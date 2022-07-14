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
const predictFromModel = (model, pureBase64Image) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`${process.env.TF_SERVING_API_URL}/v${model.current_version}/models/${model.name}:predict`);
    const response = yield axios_1.default.post(`${process.env.TF_SERVING_API_URL}/v${model.current_version}/models/${model.name}:predict`, {
        instances: [pureBase64Image],
    });
    return response;
});
const predict = (model, base64Image, getBaseImageBack) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prediction = {
            id: (0, uuid_1.v4)(),
            result: {},
        };
        if (getBaseImageBack)
            prediction.base64_image = base64Image;
        const splitedImage = base64Image.split(",");
        const response = yield predictFromModel(model, splitedImage[splitedImage.length - 1]);
        // console.log(`${process.env.TF_SERVING_API_URL}/v${model.current_version}/models/${model.name}:predict`);
        // const response = {data: {predictions: [[1, 1, 1]] }}
        const predictionOutput = response.data.predictions[0];
        for (let i = 0; i < predictionOutput.length; i++) {
            const predictionValue = predictionOutput[i];
            prediction.result[model.parameters[i].key] = Object.assign(Object.assign({}, model.parameters[i]), { value: predictionValue });
        }
        return prediction;
    }
    catch (error) {
        console.log(error);
        return { id: null };
    }
});
exports.predict = predict;
