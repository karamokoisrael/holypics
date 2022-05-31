import { getRequestParams } from './../../helpers/request-handler';
import { getDirectusStatic } from './../../helpers/auth';
import { responseWithId, responseWithSingleKey, throwError } from './../../helpers/exceptions';
import { NextFunction, Request, Response, Router } from "express";
import { deleteBackup, dump, getDumpList, restore } from "../../helpers/db";
import { ApiExtensionContext } from '@directus/shared/types';
import { ItemsService } from 'directus';
const fs = require('fs');
const AdmZip = require("adm-zip");
import * as tf from "@tensorflow/tfjs-node"
import { getHost } from '../../helpers/utils';

export default function (router: Router, { services, exceptions, getSchema, database, env }: ApiExtensionContext) {

        router.post('/predict/:id', async (req: Request, res: Response) => {
                try {
                        const host = getHost(req);
                        const { accountability, schema } = getRequestParams(req);
                        const itemsService = new ItemsService('datasets', { knex: database, accountability, schema });
                        const [dataset] = await itemsService.readByQuery({
                                filter: { name: { _eq: req.params.id } },
                                limit: 1
                        })
                        console.log(dataset.prediction_models);
                        
                        // const modelsData = await database("models").whereIn("id", dataset.prediction_models);

                        // console.log(modelsData);
                        
                        // for (let i = 0; i < modelsData.length; i++) {
                        //         const [file] = await database("directus_files").where({ id: modelsData[i].tfjs_file })
                        //         const modelDataPath = `./uploads/tmp/${file.id}`;
                        //         if (!fs.existsSync(modelDataPath)) {
                        //                 fs.mkdirSync(modelDataPath);
                        //                 const zipFile = new AdmZip(`./uploads/${file.id}.zip`);
                        //                 zipFile.extractAllTo(modelDataPath, true);
                        //         }  
                        //         const baseUrl = `${host}/file/tmp/download?path=${file.id}`             
                        //         const modelJsonUrl = `${baseUrl}/model.json`
                        //         const modelWeightsUrl = `${host}/file/${modelDataPath.replace("./", "")}/group1-shard1of3.bin`
                        //         const model =  await tf.loadLayersModel(
                        //                 // "https://storage.googleapis.com/tfjs-models/tfjs/iris_v1/model.json"
                        //                 modelJsonUrl
                        //         );

                        //         console.log(model.summary());
                                
                        // }
                        // dataset.prediction_models = modelsData;
                        return res.json({ data: dataset });
                } catch (error) {
                        console.log(error);
                        return throwError(res);
                }

        });

        router.get('/ok', async (req: Request, res: Response) => {
                try {
                        return res.json({})
                } catch (error) {
                        console.log(error);
                        return throwError(res);
                }

        });
}

