import { throwError } from './../../helpers/exceptions';
import { Request, Response, Router } from "express";
import { ApiExtensionContext } from '@directus/shared/types';
import { getConfigs } from '../../helpers/endpoints';

export default function (router: Router, { database }: ApiExtensionContext) {

        router.get('/', async (req: Request, res: Response) => {
                try {
                        const configs = await getConfigs(database, "holypics");
                        return res.json({data: configs});
                } catch (error) {
                        console.log(error);
                        return throwError(res);
                }

        });
}

