import { getRequestParams } from './../../helpers/request-handler';
import { successMessage, throwError } from './../../helpers/exceptions';
import { Request, Response, Router } from "express";
import { getTranslator } from '../../helpers/translation';
import { ItemsService } from 'directus';
import axios from 'axios';
import { getAdminTokens } from '../../helpers/auth';
import { EventContext, ExtendedApiExtensionContext } from '../../@types/directus';
import { sleep } from '../../helpers/utils';
const fs = require("fs");
const readline = require('readline');
export default function (router: Router, { database, emitter }: ExtendedApiExtensionContext) {
    router.get('/holypics-unsplash', async (req: Request, res: Response) => {
        const { t } = await getTranslator(req, database);
        try {
            type UnsplashSetting = {
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
            const { api_key, preprocessed_collections, items_per_page, last_collection_page, collection_req_query, last_collection_req_page, last_collection_req_items_per_page, prediction_sleep_ttl } = configs.unsplash_settings as UnsplashSetting;
            let { last_collection } = configs.unsplash_settings as UnsplashSetting;
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

    router.get('/holypics-raw-data', async (req: Request, res: Response) => {
        const { t } = await getTranslator(req, database);
        try {


            type RawDataSetting = {
                api_key: string,
                preprocessed_collections: string[],
                items_per_page: number,
                last_collection: number,
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
            const { items_per_page, prediction_sleep_ttl } = configs.raw_data_settings as RawDataSetting;
            let { last_collection, last_collection_page, last_collection_total_pages } = configs.raw_data_settings as RawDataSetting;
            fs.readdir('./extensions/static/txt', async (err: any, collections: string[]) => {
                collections = collections.filter(item => ![".DS_Store"].includes(item))
                let count = 0;
                let processedCount = 0;
                const fileStream = fs.createReadStream(`./extensions/static/txt/${collections[last_collection]}`);
                const exec = require('child_process').exec

                exec(`wc -l ./extensions/static/txt/${collections[last_collection]}`, async function (error: any, total: number) {
                    console.log(total)
                    if(error) console.log(error)
                    if (error) total = total;
                    console.log("processing collection => ", collections[last_collection]);

                    const readInterface = readline.createInterface({
                        input: fileStream,
                        crlfDelay: Infinity
                    });
                    for await (const line of readInterface) {
                        try {
                            if (last_collection_page > total || count > total) {
                                last_collection++;
                                last_collection_page = 1;
                                break;
                            }

                            if (processedCount > items_per_page) {
                                last_collection_page++;
                                break;
                            }

                            if (count > last_collection_page) {
                                processedCount++;
                                console.log(`${count} => ${line}`);
                                emitter.emitAction("holypics_predict_url", { imageUrl: line }, {} as EventContext)
                                if (prediction_sleep_ttl != 0) await sleep(prediction_sleep_ttl);
                            }
                        } catch (error) { } finally {
                            count++;
                        }
                    }

                    const updatePayload = configs.raw_data_settings;
                    updatePayload.last_collection_page = count;
                    updatePayload.last_collection = last_collection;
                    await configsService.upsertSingleton({ raw_data_settings: updatePayload });
                });


            });
            return res.json({});
        } catch (error) {
            console.log(error);
            return throwError(res, t("we_encountered_an_unexpected_error_during_the_operation"));
        }

    });

}


