import { getRequestParams } from './../../helpers/request-handler';
import { throwError } from './../../helpers/exceptions';
import { Request, Response, Router } from "express";
import { ApiExtensionContext } from '@directus/shared/types';
import { ItemsService } from 'directus';
import { getHost } from '../../helpers/utils';
import { Knex } from 'knex';
import { getConfigs } from '../../helpers/endpoints';

export default function (router: Router, { database }: ApiExtensionContext) {
        
        router.get('/', async (req: Request, res: Response) => {
                try {
                        const configs = await getConfigs(database);
                        return res.json(configs);
                } catch (error) {
                        console.log(error);
                        return throwError(res);
                }

        });
}

