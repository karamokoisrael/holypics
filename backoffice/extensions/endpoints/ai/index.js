"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("./../../helpers/auth");
const exceptions_1 = require("./../../helpers/exceptions");
const endpoints_1 = require("../../helpers/endpoints");
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const formidable = require('express-formidable');
const imageToBase64 = require('image-to-base64');
function default_1(router, { database }) {
    // in latest body-parser use like below.
    // router.use(bodyParser.urlencoded({ extended: true }));
    router.use(formidable());
    router.post('/predict/:model', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const reqBody = req.fields;
            const prediction = {
                id: (0, uuid_1.v4)()
            };
            prediction.textData = "";
            let base64Image = "";
            const configs = yield (0, endpoints_1.getConfigs)(database);
            const dataset = configs.datasets.find((item) => item.name == req.params.model);
            if (dataset === null || dataset === undefined)
                return (0, exceptions_1.throwError)(res, "Veuillez sélectionner un dataset valide", 400);
            if (reqBody.base64Image !== undefined) {
                base64Image = reqBody.base64Image;
            }
            else if (reqBody.imageUrl !== undefined) {
                const base64 = yield imageToBase64(reqBody.imageUrl);
                base64Image = `data:image/jpg;base64,${base64}`;
            }
            else {
                const collections = [
                    // "8909560",
                    "1242151",
                    // "1785701",
                    "8991200",
                    // "5052004"
                ];
                // Math.floor(Math.random() * (max - min + 1)) + min;
                const randomImageUrl = `https://source.unsplash.com/collection/${Math.floor(Math.random() * collections.length - 1)}`;
                const base64 = yield imageToBase64(randomImageUrl);
                base64Image = `data:image/jpg;base64,${base64}`;
            }
            prediction.base64Image = base64Image;
            const splitedImage = base64Image.split(",");
            for (const productionModel of dataset.production_models) {
                const res = yield axios_1.default.post(`${process.env.TF_SERVING_API_URL}/v${productionModel.model.version}/models/${productionModel.model.name}:predict`, {
                    instances: [splitedImage[splitedImage.length - 1]],
                    // maxContentLength: 100000000,
                    // maxBodyLength: 1000000000
                });
                if (res.data.predictions === undefined || res.data.predictions.length === 0 || res.data.predictions[0].length === 0)
                    throw new Error(`Error while prediction ${productionModel.model.name}`);
                if (res.data.predictions[0][0] > dataset.prediction_threshold) {
                    const predictionValue = Math.round(res.data.predictions[0][0] * 100);
                    prediction[productionModel.model.class_name] = predictionValue;
                    prediction.textData += `${productionModel.model.class_name}: ${predictionValue}% \n`;
                }
            }
            if (prediction.textData === "")
                prediction.textData = dataset.neutral_class_name;
            res.json({ data: prediction });
        }
        catch (error) {
            console.log("handled error => ", error);
            return (0, exceptions_1.throwError)(res);
        }
    }));
    router.post('/test', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const directus = yield (0, auth_1.getDirectusStatic)(req, "adsjkbhve");
    }));
}
exports.default = default_1;
