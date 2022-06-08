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
exports.predict = void 0;
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const predictFromModel = (productionModel, pureBase64Image) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.post(`${process.env.TF_SERVING_API_URL}/v${productionModel.model.version}/models/${productionModel.model.name}:predict`, {
        instances: [pureBase64Image],
    });
    return response;
});
const predict = (dataset, base64Image) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prediction = {
            id: (0, uuid_1.v4)(),
            textData: "",
            blurred: false,
            result: {},
            base64Image
        };
        const productionModel = dataset.production_models[0];
        const modelConfig = productionModel.model.config;
        const splitedImage = base64Image.split(",");
        const response = yield predictFromModel(productionModel, splitedImage[splitedImage.length - 1]);
        const predictionOutput = response.data.predictions[0];
        for (let i = 0; i < predictionOutput.length; i++) {
            const predictionValue = predictionOutput[i];
            prediction.result[modelConfig.classes[i]] = predictionValue;
            if (predictionValue > modelConfig.prediction_threshold) {
                prediction.textData += `${dataset.class_names[i]}: ${Math.round(predictionValue * 100)}% \n`;
            }
        }
        if (predictionOutput[predictionOutput.length - 1] < dataset.prediction_threshold)
            prediction.blurred = true;
        if (prediction.textData === "")
            prediction.textData = dataset.neutral_class_name;
        return prediction;
    }
    catch (error) {
        console.log(error);
        return { id: null };
    }
});
exports.predict = predict;
