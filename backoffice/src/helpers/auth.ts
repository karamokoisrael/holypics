import { UserToken } from '../@types/user';
import * as jwt from "jsonwebtoken";
import { Request } from 'express';

export const getToken = (identifierData: UserToken, expiration="1440h")=>{
    const token = jwt.sign(
        JSON.parse(JSON.stringify(identifierData)),
        process.env.SECRET as string,
        {
            expiresIn: expiration,
        }
        );
    return token;
}

export const decodeToken = (req: Request, givenToken=null)=>{
    try {
        const token = req == null ? givenToken : req.headers["x-access-token"];
        const decoded = jwt.verify(token as string, process.env.SECRET as string);
        if(decoded == null || decoded == undefined || Object.keys(decoded).length == 0) return null;
        return decoded;
    } catch (e) {
        return null;
    }
}
    