import { getAdminTokens, getDirectusStatic } from './../../helpers/auth'; 
import { ApiExtensionContext } from '@directus/shared/types';
import { Router, Request, Response } from "express";
import { throwError } from '../../helpers/exceptions';
import { getRequestParams } from '../../helpers/request-handler'
import { getHost } from '../../helpers/utils';


export default (router: Router, { services, exceptions, getSchema, database, env }: ApiExtensionContext) => {

    router.get('/translations', async (req: Request, res: Response) => {
        try { 
            const { access_token } = await getAdminTokens(database);
            const directus = await getDirectusStatic(req, access_token)
            const { filters } = getRequestParams(req);
            const settings = directus.settings.read({filter: {...filters}})
            res.json(settings) 
        } catch (error) {
            return throwError(res); 
        }
	}); 

    router.get('/file/:id', async (req: Request, res: Response) => {
        try {   
            res.redirect(`${getHost(req)}/file/${req.params.id}`)
        } catch (error) {
            console.log(error);
            return throwError(res); 
        }
	}); 
};
