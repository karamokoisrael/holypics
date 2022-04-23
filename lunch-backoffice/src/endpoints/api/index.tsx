import { getAdminTokens, getDirectusStatic } from './../../helpers/auth'; 
import { ApiExtensionContext } from '@directus/shared/types';
import { Router, Request, Response } from "express";
import { throwError } from '../../helpers/exceptions';
import { getRequestParams } from '../../helpers/request-handler'


export default (router: Router, { services, exceptions, getSchema, database, env }: ApiExtensionContext) => {

    router.get('/translations', async (req: Request, res: Response) => {
        try { 
            //@ts-ignore
            console.log(services);
            
            const { access_token } = await getAdminTokens(database);
            // const data = await getTranslations(req, access_token);
            const directus = await getDirectusStatic(req, access_token)
            // directus.items('products').readOne()
            
            // const settings = directus.items('settings').readByQuery({ fields: ['*'], limit: -1 });
            const { filters } = getRequestParams(req);
            const settings = directus.settings.read({filter: {...filters}})
            res.json(settings) 
        } catch (error) {
            return throwError(res); 
        }
	}); 

};
