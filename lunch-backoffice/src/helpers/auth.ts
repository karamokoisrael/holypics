import { ADMIN_ACCESS_TOKEN_CACHE_KEY, ADMIN_ID_CACHE_KEY, USER_TOKEN_EXPIRATION } from './../consts/global';
import { getHost } from './utils';
import { Knex } from 'knex';
import User, { UserToken } from '../@types/user';
import * as jwt from "jsonwebtoken";
import { Request } from 'express';
import { v4 } from "uuid";
import { MAX_LOGIN_ATTEMPTS } from '../consts/global';
import { getCacheValue, setCacheValue } from './cache';
import { Directus } from '@directus/sdk';
import { AdminTokens, DirectusDecodeToken, DirectusDecodeTokenOuput } from '../@types/directus';

export const getAdminTokens = async (database: Knex): Promise<AdminTokens>=>{
    let accessToken = "";
    let adminId: string | undefined = "";
    try {
        const cachedToken = getCacheValue<string>(ADMIN_ACCESS_TOKEN_CACHE_KEY)
        const cachedId = getCacheValue<string>(ADMIN_ID_CACHE_KEY)
        if(cachedToken != null && cachedToken!= undefined && cachedId != null && cachedId!= undefined){
            accessToken = cachedToken; 
            adminId = cachedId;
        }else{
            const [[{token, id}]] = await database.raw("SELECT directus_users.token, directus_users.id from directus_roles RIGHT JOIN directus_users ON directus_users.role = directus_roles.id AND directus_users.token IS NOT NULL WHERE directus_roles.admin_access=1 LIMIT 1");
            adminId = id;
            setCacheValue(ADMIN_ACCESS_TOKEN_CACHE_KEY, token);
            accessToken = token 
        }
        return { access_token:  accessToken, admin_id: adminId };
    } catch (error) {
        return { access_token: "", admin_id: undefined};
    }   
}

export const getDirectusStatic = async (req: Request, accessToken: string)=>{
    const directus = new Directus(getHost(req) as string)
    const authResult = await directus.auth.static(accessToken)
    // console.log(authResult);
    return directus;
}

export const getDirectus = async (req: Request, email: string, password: string)=>{
    const directus = new Directus(getHost(req) as string)
    const authResult = await directus.auth.login({ email, password })
    return { directus, authResult };
}

export const secureUserData = (user: Record<string, any>, req: Request | null=null, additionalProps: Record<string, any>={}, currentAccessToken: string | null = null)=>{
    try {
        const accessToken = req == null ? currentAccessToken : getUserAccessToken(req);
        return {data: {...user, password: null, token: accessToken, ...additionalProps}}
    } catch (error) {
        console.log(error);
        return {data: {...user, password: null, token: null, ...additionalProps}}
    }
    
}

export const getToken = (identifierData: UserToken, expiration=USER_TOKEN_EXPIRATION)=>{
    const token = jwt.sign(
        JSON.parse(JSON.stringify(identifierData)),
        process.env.SECRET as string,
        {
            expiresIn: expiration,
        }
        );
    return token;
}

export const decodeToken = (req: Request | null=null, givenToken=null): DirectusDecodeTokenOuput=>{
    try {
        const token = req == null ? givenToken : getUserAccessToken(req);
        const decoded = jwt.verify(token as string, process.env.SECRET as string, { issuer: 'directus' }) as DirectusDecodeToken;
        return { decoded, token};
    } catch (error) {
        return { decoded: null, token: null};
    }
}

export const getUserAccessToken = (req: Request)=>{
    const authorization = req.headers["authorization"] as string
    if (authorization.startsWith("Bearer ")){
        return authorization.substring(7, authorization.length);
   } else {
      return null;
   }
}

export const generateVerificationCode = async (database: Knex, userId: number | null =null, email: string | null =null, currentAlertLevel=-1, toggleAlertLevel=false)=>{
    const idField = userId == null ? 'email': 'id'
    const idValue = userId == null ? email: userId
    const verificationCode = v4();
    // if(toggleAlertLevel){
    //     increaseAlertLevel(database, userId, email, currentAlertLevel);
    // }

    await database('directus_users').update({ verification_code: verificationCode }).where(idField, '=', idValue);
    
    return verificationCode;
}

export const checkoutAlertLevel = (alertLevel: number, reinit=false)=>{
    let accountLocked = 0;
    if(alertLevel >= MAX_LOGIN_ATTEMPTS){
        alertLevel = 0;
        accountLocked = 1;
    }else{
        if(alertLevel == 0 && !reinit){
            accountLocked = 0;
        }
    }

    

    return [alertLevel, accountLocked]
}

export const reinitAlertLevel = async (database: Knex, userId: number | null =null, email: string | null =null)=>{
    await updateAlertLevel(database, 0, userId, email, true);
}

export const increaseAlertLevel = async (database: Knex, userId: number | null =null, email: string | null =null, currentAlertLevel=-2)=>{
    await updateAlertLevel(database, currentAlertLevel+1, userId, email);
}

export const updateAlertLevel = async (database: Knex, alertLevel=-1, userId: number | null =null, email: string | null =null, reinit=false)=>{
    const idField = userId == null ? 'email': 'id'
    const idValue = userId == null ? email: userId
    let accountLocked = 0;
    if(alertLevel == -1){
        const [ user ] = await database<User>('directus_users');
        alertLevel = user.alert_level;
    }

    [alertLevel, accountLocked] = checkoutAlertLevel(alertLevel, reinit);
    await database('directus_users').update({alert_level: alertLevel, account_locked: accountLocked}).where(idField, '=', idValue);
}


    