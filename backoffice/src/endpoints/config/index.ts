import { ItemsService } from 'directus';
import { getRequestParams } from './../../helpers/request-handler';
import { throwError } from './../../helpers/exceptions';
import { Request, Response, Router } from "express";
import { ApiExtensionContext } from '@directus/shared/types';
import { getTranslator } from '../../helpers/translation';
import { getAdminTokens } from '../../helpers/auth';

export default function (router: Router, { database }: ApiExtensionContext) {
        router.get('/', async (req: Request, res: Response) => {
                const { t, lang } = await getTranslator(req, database);
                try {
                        const { admin_id } = await getAdminTokens(database);
                        const { schema, accountability } = getRequestParams(req, true);
                        const itemsService = new ItemsService("models", {
                                schema, accountability: {
                                        ...accountability, user: admin_id as string
                                }
                        });
                        const modelsData = await itemsService.readByQuery({
                                filter: { featured: { _eq: true }, status: { _eq: "published" } },
                                // @ts-ignore
                                deep: { "translations": { "_filter": { "languages_id": { "_eq": lang } } } }
                        });
                        const data = {
                                models: modelsData?.map((model: Record<string, any>) => {
                                        const translations = model.translations.find((item: Record<string, any>) => item.languages_id == lang)
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


