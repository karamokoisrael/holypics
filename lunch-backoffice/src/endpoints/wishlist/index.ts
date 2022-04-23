import { getRequestParams } from './../../helpers/request-handler';
import { generateVerificationCode, updateAlertLevel, increaseAlertLevel, getAdminTokens, secureUserData, getDirectus, getDirectusStatic, decodeToken } from './../../helpers/auth'; 
import { ApiExtensionContext, Notification } from '@directus/shared/types';
import { Router, Request, Response, NextFunction } from "express";
import { sendMail } from "../../helpers/mailer"
import { throwError } from '../../helpers/exceptions';
import Joi from "joi";
import * as authHandler from "../../helpers/auth";
import { getJoiError } from '../../helpers/validation';
import { AuthenticationService, ItemsService, MailService, NotificationsService, UsersService } from 'directus';
import { ObjectToEqFilter } from '../../helpers/directus';
import { PrimaryKey } from 'directus/dist/types';
import { NotificationPayload } from '../../@types/directus';


export default (router: Router, { services, exceptions, getSchema, database, env }: ApiExtensionContext) => {
    

    router.post('/testNotif', async (req: Request, res: Response) => {
        try { 
            const { schema, accountability } = getRequestParams(req);
            const { decoded } = authHandler.decodeToken(req);
            const notificationsService = new NotificationsService({ knex: database, schema, accountability});
            const { access_token, admin_id } = await getAdminTokens(database); 
            const directus = await getDirectusStatic(req, access_token);     
            // directus      
            // const notificationPayload: NotificationPayload = {sender: admin_id?.toString(), recipient: decoded?.id as string, subject: "dad", message: "hey", collection: "product_views", item: "dad"}
            // await notificationsService.createOne(notificationPayload);
        } catch (error) {
            console.log(error);
            
            return throwError(res); 
        }
	}); 


};
