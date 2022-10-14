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
const request_handler_1 = require("../../helpers/request-handler");
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const exceptions_1 = require("../../helpers/exceptions");
const translation_1 = require("../../helpers/translation");
const directus_1 = require("directus");
const auth_1 = require("../../helpers/auth");
const imageToBase64 = require('image-to-base64');
function default_1(router, { database }) {
    // @ts-ignore
    router.use(express_1.default.json({ limit: "10mb", extended: true }));
    router.use(express_1.default.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));
    router.post('/predict', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { t } = yield (0, translation_1.getTranslator)(req, database);
        try {
            const { schema, accountability } = (0, request_handler_1.getRequestParams)(req, true);
            const { admin_id } = yield (0, auth_1.getAdminTokens)(database);
            const configsService = new directus_1.ItemsService("configurations", { schema, accountability: Object.assign(Object.assign({}, accountability), { user: admin_id }) });
            const configs = yield configsService.readSingleton({});
            const { models_paths } = configs.holypics_settings;
            const reqBody = req.body.base64 ? { instances: [req.body.base64] } : req.body;
            const requests = [];
            for (const modelPath of models_paths) {
                requests.push(axios_1.default.post(`${process.env.TF_SERVING_API_URL}${modelPath}`, reqBody));
            }
            const predictions = [];
            const responses = yield axios_1.default.all(requests);
            for (const response of responses) {
                const predictionData = {};
                for (let i = 0; i < response.data.predictions.length; i++) {
                    const prediction = response.data.predictions[i];
                    for (let u = 0; u < prediction.classes.length; u++) {
                        predictionData[prediction.classes[u]] = prediction.scores[u];
                    }
                    predictions[i] = Object.assign(Object.assign({}, predictions[i]), predictionData);
                }
            }
            return res.json(predictions);
        }
        catch (error) {
            console.log(error);
            return (0, exceptions_1.throwError)(res, t("we_encountered_an_unexpected_error_during_the_operation"));
        }
    }));
}
exports.default = default_1;
