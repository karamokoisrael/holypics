import { ApiExtensionContext, Notification } from '@directus/shared/types';
import { Router, Request, Response } from "express";
import { throwError} from '../../helpers/exceptions';
import Joi from "joi";
import * as authHandler from "../../helpers/auth";
import { getJoiError } from '../../helpers/validation';
import { ItemsService } from 'directus';
import { ObjectToEqFilter } from '../../helpers/directus';
import { PrimaryKey } from 'directus/dist/types';
import { Product } from '../../@types/product';
import { v4 } from "uuid";
import { ItemMetadata } from '@directus/sdk';
import { notify } from '../../helpers/notification';
import { NotificationPayload } from '../../@types/directus';
const moment = require('moment');

export default (router: Router, { services, exceptions, getSchema, database, env }: ApiExtensionContext) => {
    
    router.get('/', async (req: Request, res: Response) => {
        try { 
            const { decoded } = authHandler.decodeToken(req);
            const { access_token } = await authHandler.getAdminTokens(database);
            const directus = await authHandler.getDirectusStatic(req, access_token);
            const filter = req.query.filter as Record<string, any>;
            const meta = req.query.meta as keyof ItemMetadata | undefined
            const page = req.query.page || undefined as number | undefined
            if(filter?.sender != undefined && filter?.sender != null) delete filter.sender 
            if(filter?.recipient != undefined && filter?.recipient != null) delete filter.recipient 
                 
            const notifications = await directus.items("directus_notifications").readByQuery({
                filter: {...filter,  recipient: {_eq: decoded?.id} },
                meta: "*",
                page: page != undefined ? parseInt(page as string) : undefined
            }) as Notification[]
        
            res.json(notifications);
        } catch (error) {
            console.log(error);
            return throwError(res); 
        }
	}); 

    router.post('/', async (req: Request, res: Response) => {
        try { 
            const { decoded } = authHandler.decodeToken(req);
            const { access_token } = await authHandler.getAdminTokens(database);
            const mailService = new services.MailService(await getSchema())

            const notification = await notify(
                database, mailService, "hey", "ffwfw", "da347118-dc7b-4bac-93e0-9e121bbc9578",
                null, null, true, true)

            res.json({data: notification});
        } catch (error) {
            console.log(error);
            return throwError(res); 
        }
	}); 

    

};
