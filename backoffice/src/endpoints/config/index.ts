import { ItemsService } from 'directus';
import { getRequestParams } from './../../helpers/request-handler';
import { getDirectusStatic } from './../../helpers/auth';
import { throwError } from './../../helpers/exceptions';
import { Request, Response, Router } from "express";
import { ApiExtensionContext } from '@directus/shared/types';
import { getAdminTokens } from '../../helpers/auth';
import { getTranslator } from '../../helpers/translation';
import moment from "moment";
import { UsersService } from 'directus';

export default function (router: Router, { database }: ApiExtensionContext) {

        router.get('/', async (req: Request, res: Response) => {
                const { t, lang } = await getTranslator(req, database);
                try {
                        const { schema, accountability } = getRequestParams(req, true);
                        const itemsService = new ItemsService("models", { schema, accountability });
                        const modelsData = await itemsService.readByQuery({});
                        const data = {
                                models: modelsData?.map((model: Record<string, any>) => {
                                        const translations = model.translations.find((item: Record<string, any>) => item.languages_id == lang)
                                        model.translations = undefined;
                                        return { ...(translations != null && translations != undefined ? translations : {}), ...model }
                                })
                        }
                        return res.json({ data });
                } catch (error) {
                        console.log(error);
                        return throwError(res, t("we_encountered_an_unexpected_error_during_the_operation"));
                }

        });


        router.get('/sub', async (req: Request, res: Response) => {
                const { t, lang } = await getTranslator(req, database);
                try {
                        const { schema, accountability } = getRequestParams(req, true);
                        accountability.admin = true;
                        const userService = new UsersService({ schema, accountability });
                        const users = await userService.readByQuery({});
                        return res.json(users);
                } catch (error) {
                        console.log(error);
                        return throwError(res, t("we_encountered_an_unexpected_error_during_the_operation"));
                }

        });
}

