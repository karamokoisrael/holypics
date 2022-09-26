import { getDirectusStatic } from './../../helpers/auth';
import { throwError } from './../../helpers/exceptions';
import { Request, Response, Router } from "express";
import { ApiExtensionContext } from '@directus/shared/types';
import { getAdminTokens } from '../../helpers/auth';
import { getTranslator } from '../../helpers/translation';

export default function (router: Router, { database }: ApiExtensionContext) {

        router.get('/', async (req: Request, res: Response) => {
                const { t, lang } = await getTranslator(req, database);
                try {
                        const { access_token } = await getAdminTokens(database);
                        const directus = await getDirectusStatic(req, access_token);
                        const modelsData = await directus.items("models").readByQuery();
                        const data = {
                                models: modelsData.data?.map((model: Record<string, any>) => {

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
}

