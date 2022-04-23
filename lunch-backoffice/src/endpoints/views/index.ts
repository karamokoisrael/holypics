import { Knex } from 'knex';
import { AppSettings } from './../../@types/global';
import { throwViewError } from './../../helpers/exceptions';
import { renderTemplate } from './../../helpers/template';
import { Router, Response, Request } from "express";
import { ApiExtensionContext } from "@directus/shared/types";
import { v4 } from "uuid";
import User from '../../@types/user';

export default (router: Router, { services, exceptions, getSchema, database, env }: ApiExtensionContext) => {
    router.get('/', async (req, res, next) => {  
        renderTemplate(req, res, {title: "Testing out", headerText: "ok", content: "Nous testons les mails", btnText: "retourner à l'admin", btnUrl:"https://cryptomarket-ci.com"})
    }); 

    router.get('/user/confirm-email', async (req: Request, res: Response) => { 
        try {
            const [ user ] = await database<User>('directus_users').where('email', '=', req.query.email as string).where('verification_code', '=', req.query.verificationCode as string);
            await database('directus_users').update({ email_verified: 1, verification_code: v4()}).where('email', '=', req.query.email as string).where('verification_code', '=', req.query.verificationCode as string);
            renderTemplate(req, res, 
                {firstName: user.first_name, lastName: user.last_name},
                "email-confirmed",
                "liquid",
                "intl",
                database
            )
        } catch (error) {
            throwViewError(req, res, "intl", database as Knex | null);
        }
    }); 

    router.get('/user/reinit-password', async (req: Request, res: Response) => { 
        try {
            const [ user ] = await database<User>('directus_users').where('email', '=', req.query.email as string).where('verification_code', '=', req.query.verificationCode as string);
            renderTemplate(req, res, 
                {firstName: user.first_name, lastName: user.last_name},
                "reinit-password",
                "html",
                "intl",
                database
            )
        } catch (error) {
            throwViewError(req, res, "intl", database as Knex | null);
        }
    }); 

    router.get('/order', async (req: Request, res: Response) => { 
        try {
            renderTemplate(req, res, 
                {},
                "order",
                "liquid",
                "intl",
                database
            )
        } catch (error) {
            throwViewError(req, res, "intl", database as Knex | null);
        }
    }); 
        
};