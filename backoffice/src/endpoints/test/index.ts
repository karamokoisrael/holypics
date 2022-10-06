import { getRequestParams } from './../../helpers/request-handler';
import { successMessage, throwError } from './../../helpers/exceptions';
import { Request, Response, Router } from "express";
import { ApiExtensionContext } from '@directus/shared/types';
import { getTranslator } from '../../helpers/translation';
import { UsersService, ItemsService } from 'directus';
import axios from 'axios';
import { getAdminTokens } from '../../helpers/auth';
const imageToBase64 = require('image-to-base64');

export default function (router: Router, { database }: ApiExtensionContext) {

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

    router.get('/holypics-unplash', async (req: Request, res: Response) => {
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
                model_path: string
            }
            const { schema, accountability } = getRequestParams(req, true);
            const { admin_id } = await getAdminTokens(database);
            const configsService = new ItemsService("configurations", { schema, accountability: { ...accountability, user: admin_id as string } });
            const feedbacksService = new ItemsService("feedbacks", { schema, accountability: { ...accountability, user: admin_id as string } });
            const configs = await configsService.readSingleton({});
            const { api_key, preprocessed_collections, items_per_page, last_collection, last_collection_page, neutral_class, neutral_class_danger_probability, collection_req_query, last_collection_req_page,  last_collection_req_items_per_page, model_path } = configs.unsplash_settings as UnplashSetting;
            const headers = { Authorization: `Client-ID ${api_key}` }
            const collectionsReq = await axios.get(`https://api.unsplash.com/search/collections?page=${last_collection_req_page}&per_page=${last_collection_req_items_per_page}&query=${collection_req_query}`, { headers })
            const collections: string[] = collectionsReq.data.results.map((item: any)=> item.id);
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
                            last_collection_total_pages:  Math.round(parseInt(collectionsPhotosReq.headers["x-total"]) / items_per_page)
                        }
                    });
                    return successMessage(res, "moving to new collection");
                } else {
                    return throwError(res, t("last_item_reached"));
                }
            }
            for (const imageData of collectionsPhotosReq.data) {
                try {
                    const image_url = imageData?.urls?.small;
                    const base64 = await imageToBase64(image_url);
                    const predictionReq = await axios.post(`${process.env.TF_SERVING_API_URL as string}${model_path}`,
                        { instances: [base64] }
                    )
                    const prediction = predictionReq.data.predictions[0];
                    const predictionData = {} as Record<string, any>;
                    for (let i = 0; i < prediction.scores.length; i++) {
                        predictionData[prediction.classes[i]] = prediction.scores[i];
                    }
                    if (predictionData[neutral_class] <= neutral_class_danger_probability) {
                        await feedbacksService.createOne({
                            image_url,
                            prediction_data: predictionData,
                            unsplash_collection: last_collection
                        })
                    }
                } catch (error) { }
                break;
            }

            await configsService.upsertSingleton({ unsplash_settings: { ...updatePayload, last_collection_page: updatePayload.last_collection_page + 1 } });
            return res.json({ ...updatePayload, api_key: null });
        } catch (error) {
            console.log(error);
            return throwError(res, t("we_encountered_an_unexpected_error_during_the_operation"));
        }

    });
}


