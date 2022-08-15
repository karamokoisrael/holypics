import { predict } from './../../helpers/ai';
import { getDirectusStatic } from './../../helpers/auth';
import { throwError } from './../../helpers/exceptions';
import { Request, Response, Router } from "express";
import { ApiExtensionContext } from '@directus/shared/types';
import { getConfigs } from '../../helpers/endpoints';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";
import { getTranslator } from '../../helpers/translation';
import bodyParser from 'body-parser';
const imageToBase64 = require('image-to-base64');
const multer = require('multer');
export default function (router: Router, { database }: ApiExtensionContext) {

        
        router.use(bodyParser.json()); 
        // in latest body-parser use like below.
        router.use(bodyParser.urlencoded({ extended: true }));
        // router.use(expressFormidable());


        router.post('/predict/:model', multer().single('file'), async (req: Request, res: Response) => {
                const t = await getTranslator(req, database)
                try {
                        const reqBody = (req as Record<string, any>).body
                        let base64Image = "";
                        
                        const modelData = await getConfigs(database, req.params.model as string);
                        if (modelData.id == undefined) return throwError(res, t("we_encountered_an_unexpected_error_during_the_operation"), 400);
                        const file = (req as Record<string, any>)?.file?.buffer;
                        
                        const getBaseImageBack = reqBody.get_image_back !== undefined && Boolean(reqBody.get_image_back) == true;

                        if (file !== undefined) {
                                const base64 = file.toString('base64');
                                base64Image = `data:image/jpg;base64,${base64}`;
                        }else if(reqBody.base64_image !== undefined){
                                const splitted = reqBody.base64_image.split(",")
                                const base64 = splitted[splitted.length-1]
                                base64Image = `data:image/jpg;base64,${base64}`;
                        }else if (reqBody.url !== undefined) {                              
                                const base64 = await imageToBase64(reqBody.url)
                                base64Image = `data:image/jpg;base64,${base64}`; 
                        }else {
                                const collections = [
                                        // "8909560",
                                        "1242151",
                                        // "1785701",
                                        // "8991200",
                                        // "5052004"
                                ]
                                // Math.floor(Math.random() * (max - min + 1)) + min;
                                const randomImageUrl = `https://source.unsplash.com/collection/${Math.floor(Math.random() * collections.length - 1)}`
                                const base64 = await imageToBase64(randomImageUrl)
                                base64Image = `data:image/jpg;base64,${base64}`
                        }

                        const prediction = await predict(modelData, base64Image, getBaseImageBack, t)
                        res.json({ data: prediction });
                } catch (error) {
                        console.log("handled error => ", error);
                        return throwError(res, t("we_encountered_an_unexpected_error_during_the_operation"));
                }
        });
}



