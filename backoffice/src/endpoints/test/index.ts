import { getRequestParams } from './../../helpers/request-handler';
import { successMessage, throwError } from './../../helpers/exceptions';
import { Request, Response, Router } from "express";
import { getTranslator } from '../../helpers/translation';
import { ItemsService } from 'directus';
import axios from 'axios';
import { getAdminTokens } from '../../helpers/auth';
import { EventContext, ExtendedApiExtensionContext } from '../../@types/directus';
import { sleep } from '../../helpers/utils';

export default function (router: Router, { database, emitter }: ExtendedApiExtensionContext) {
    router.get('/holypics-unsplash', async (req: Request, res: Response) => {
        const { t } = await getTranslator(req, database);
        try {
            type UnplashSetting = {
                api_key: string,
                preprocessed_collections: string[],
                items_per_page: number,
                last_collection: string,
                last_collection_page: number,
                neutral_class: string,
                neutral_class_danger_probability: number,
                last_collection_total_pages: number,
                collection_req_query: string,
                last_collection_req_page: number,
                last_collection_req_items_per_page: number,
                model_path: string,
                prediction_sleep_ttl: number
            }
            const { schema, accountability } = getRequestParams(req, true);
            const { admin_id } = await getAdminTokens(database);
            const configsService = new ItemsService("configurations", { schema, accountability: { ...accountability, user: admin_id as string } });
            const configs = await configsService.readSingleton({});
            const { api_key, preprocessed_collections, items_per_page, last_collection_page, collection_req_query, last_collection_req_page, last_collection_req_items_per_page, prediction_sleep_ttl } = configs.unsplash_settings as UnplashSetting;
            let { last_collection } = configs.unsplash_settings as UnplashSetting;
            const headers = { Authorization: `Client-ID ${api_key}` }
            const collectionsReq = await axios.get(`https://api.unsplash.com/search/collections?page=${last_collection_req_page}&per_page=${last_collection_req_items_per_page}&query=${collection_req_query}`, { headers })
            const collections: string[] = collectionsReq.data.results.map((item: any) => item.id);
            if (last_collection == "") last_collection = collections[0];
            const collectionsPhotosReq = await axios.get(`https://api.unsplash.com/collections/${last_collection}/photos?page=${last_collection_page}&per_page=${items_per_page}`, { headers })
            const updatePayload = configs.unsplash_settings;
            if (parseInt(collectionsPhotosReq.headers["x-total"]) < last_collection_page * items_per_page) {
                const collectionIndex = collections.findIndex(item => item == last_collection);
                const nextCollection = collections.find((item, i) => !preprocessed_collections.includes(item) && i >= collectionIndex);
                if (nextCollection != undefined && nextCollection != null) {
                    await configsService.upsertSingleton({
                        unsplash_settings: {
                            ...updatePayload,
                            last_collection: nextCollection,
                            last_collection_page: 1,
                            preprocessed_collections: [...preprocessed_collections, last_collection],
                            last_collection_total_pages: Math.round(parseInt(collectionsPhotosReq.headers["x-total"]) / items_per_page)
                        }
                    });
                    await axios.get(`${process.env.PUBLIC_URL}/test/holypics-unsplash`)
                    return successMessage(res, "moving to new collection");
                } else {
                    return throwError(res, t("last_item_reached"));
                }
            }
            for (const imageData of collectionsPhotosReq.data) {
                try {
                    const image_url = imageData?.urls?.small;
                    emitter.emitAction("holypics_predict_url", { imageUrl: image_url }, {} as EventContext)
                    if (prediction_sleep_ttl != 0) await sleep(prediction_sleep_ttl);
                } catch (error) { }
            }

            await configsService.upsertSingleton({ unsplash_settings: { ...updatePayload, last_collection_page: updatePayload.last_collection_page + 1 } });
            return res.json({ ...updatePayload, api_key: null });
        } catch (error) {
            console.log(error);
            return throwError(res, t("we_encountered_an_unexpected_error_during_the_operation"));
        }

    });

}


