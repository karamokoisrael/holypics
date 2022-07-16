import { getDirectusStatic } from './../../helpers/auth';
import { throwError } from './../../helpers/exceptions';
import { Request, Response, Router } from "express";
import { ApiExtensionContext } from '@directus/shared/types';
import { getConfigs } from '../../helpers/endpoints';
import { getAdminTokens } from '../../helpers/auth';

export default function (router: Router, { database }: ApiExtensionContext) {

        router.get('/', async (req: Request, res: Response) => {
                try {
                        const { access_token } = await getAdminTokens(database);
                        const directus = await getDirectusStatic(req, access_token);
                        const modelsData = await directus.items("models").readByQuery();
                        const data =  { models: modelsData.data }
                        // const configs = await getConfigs(database, "holypics");
                        return res.json({ data });
                } catch (error) {
                        console.log(error);
                        return throwError(res);
                }

        });
}

