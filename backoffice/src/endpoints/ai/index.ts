import { getDirectusStatic } from './../../helpers/auth';
import { throwError } from './../../helpers/exceptions';
import { Request, Response, Router } from "express";
import { ApiExtensionContext } from '@directus/shared/types';
import { getConfigs } from '../../helpers/endpoints';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";

const formidable = require('express-formidable');
const imageToBase64 = require('image-to-base64');

export default function (router: Router, { database }: ApiExtensionContext) {

        // in latest body-parser use like below.
        // router.use(bodyParser.urlencoded({ extended: true }));
        router.use(formidable());

        router.post('/predict/:model', async (req: Request, res: Response) => {
                try {
                        const reqBody = (req as Record<string, any>).fields
                        const prediction: Record<string, any> = {
                                id: uuidv4()
                        };

                        prediction.textData = "";
                        let base64Image = "";
                        const configs = await getConfigs(database);
                        const dataset = configs.datasets.find((item) => item.name == req.params.model)
                        if (dataset === null || dataset === undefined) return throwError(res, "Veuillez sélectionner un dataset valide", 400);



                        if (reqBody.base64Image !== undefined) {
                                base64Image = reqBody.base64Image;
                        } else if (reqBody.imageUrl !== undefined) {
                                const base64 = await imageToBase64(reqBody.imageUrl)
                                base64Image = `data:image/jpg;base64,${base64}`
                        } else {
                                const collections = [
                                        // "8909560",
                                        "1242151",
                                        // "1785701",
                                        "8991200",
                                        // "5052004"
                                ]
                                // Math.floor(Math.random() * (max - min + 1)) + min;
                                const randomImageUrl = `https://source.unsplash.com/collection/${Math.floor(Math.random() * collections.length - 1)}`
                                const base64 = await imageToBase64(randomImageUrl)
                                base64Image = `data:image/jpg;base64,${base64}`
                        }

                        prediction.base64Image = base64Image;
                        const splitedImage = base64Image.split(",");
                        for (const productionModel of dataset.production_models) {
                                const res = await axios.post(`${process.env.TF_SERVING_API_URL}/v${productionModel.model.version}/models/${productionModel.model.name}:predict`, {
                                        instances: [splitedImage[splitedImage.length - 1]],
                                        // maxContentLength: 100000000,
                                        // maxBodyLength: 1000000000
                                })

                                if (res.data.predictions === undefined || res.data.predictions.length === 0 || res.data.predictions[0].length === 0) throw new Error(`Error while prediction ${productionModel.model.name}`);
                                if (res.data.predictions[0][0] > dataset.prediction_threshold) {
                                        const predictionValue = Math.round(res.data.predictions[0][0] * 100)
                                        prediction[productionModel.model.class_name] = predictionValue
                                        prediction.textData += `${productionModel.model.class_name}: ${predictionValue}% \n`
                                }
                        }
                        if (prediction.textData === "") prediction.textData = dataset.neutral_class_name;
                        res.json({ data: prediction })
                } catch (error) {
                        console.log("handled error => ", error);
                        return throwError(res);
                }
        });

        router.post('/test', async (req: Request, res: Response) => {
                const directus = await getDirectusStatic(req, "adsjkbhve")
        });

}


