import { getDirectusStatic } from './../../helpers/auth';
import { throwError } from './../../helpers/exceptions';
import { Request, Response, Router } from "express";
import { ApiExtensionContext } from '@directus/shared/types';
import { getConfigs } from '../../helpers/endpoints';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";

const bodyParser = require('body-parser');
export default function (router: Router, { database }: ApiExtensionContext) {

        router.use(bodyParser.json({ limit: '50mb' }));
        router.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
        router.post('/predict/:model', async (req: Request, res: Response) => {
                try {
                        return res.json({});

                        // const prediction: Record<string, any> = {
                        //         id: uuidv4()
                        // };

                        // prediction.textData = "";
                        // let base64Image = "";
                        // const configs = await getConfigs(database);
                        // const dataset = configs.datasets.find((item) => item.name == req.params.model)
                        // if (dataset === null || dataset === undefined) return throwError(res, "Veuillez sélectionner un dataset valide", 400);

                       
                        
                        // if (req.body.base64Image !== undefined) {
                        //         base64Image = req.body.base64Image;
                        // } else {
                        //         return throwError(res, "Veuillez sélectionner une image valide", 400);
                        // }

                        // for (const productionModel of dataset.production_models) {
                        //         const res = await axios.post(`${process.env.TF_SERVING_API_URL}/v${productionModel.model.version}/models/${productionModel.model.name}:predict`, {
                        //                 instances: [base64Image],
                        //                 maxContentLength: 100000000,
                        //                 maxBodyLength: 1000000000
                        //         })

                        //         if (res.data.predictions === undefined || res.data.predictions.length === 0 || res.data.predictions[0].length === 0) throw new Error(`Error while prediction ${productionModel.model.name}`);
                        //         const predictionValue = res.data.predictions[0][0]
                        //         prediction[productionModel.model.name] = predictionValue
                        //         prediction.textData += `${productionModel.model.name}: ${predictionValue} \n`
                        // }
                        // res.json({ data: prediction })
                } catch (error) {
                        console.log("handled error => ", error);
                        return throwError(res);
                }

        });

        router.post('/test', async (req: Request, res: Response) => {
                const directus = await getDirectusStatic(req, "adsjkbhve")
        });

}


