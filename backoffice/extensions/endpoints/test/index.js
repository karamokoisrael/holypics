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
const request_handler_1 = require("./../../helpers/request-handler");
const exceptions_1 = require("./../../helpers/exceptions");
const translation_1 = require("../../helpers/translation");
const directus_1 = require("directus");
const axios_1 = __importDefault(require("axios"));
const auth_1 = require("../../helpers/auth");
const imageToBase64 = require('image-to-base64');
function default_1(router, { database }) {
    router.get('/holypics-unsplash', (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { t } = yield (0, translation_1.getTranslator)(req, database);
        try {
            const { schema, accountability } = (0, request_handler_1.getRequestParams)(req, true);
            const { admin_id } = yield (0, auth_1.getAdminTokens)(database);
            const configsService = new directus_1.ItemsService("configurations", { schema, accountability: Object.assign(Object.assign({}, accountability), { user: admin_id }) });
            const feedbacksService = new directus_1.ItemsService("feedbacks", { schema, accountability: Object.assign(Object.assign({}, accountability), { user: admin_id }) });
            const configs = yield configsService.readSingleton({});
            const { api_key, preprocessed_collections, items_per_page, last_collection, last_collection_page, neutral_class, neutral_class_danger_probability, collection_req_query, last_collection_req_page, last_collection_req_items_per_page, model_path } = configs.unsplash_settings;
            const headers = { Authorization: `Client-ID ${api_key}` };
            const collectionsReq = yield axios_1.default.get(`https://api.unsplash.com/search/collections?page=${last_collection_req_page}&per_page=${last_collection_req_items_per_page}&query=${collection_req_query}`, { headers });
            const collections = collectionsReq.data.results.map((item) => item.id);
            const collectionsPhotosReq = yield axios_1.default.get(`https://api.unsplash.com/collections/${last_collection}/photos?page=${last_collection_page}&per_page=${items_per_page}`, { headers });
            const updatePayload = configs.unsplash_settings;
            if (parseInt(collectionsPhotosReq.headers["x-total"]) < last_collection_page * items_per_page) {
                const collectionIndex = collections.findIndex(item => item == last_collection);
                const nextCollection = collections.find((item, i) => !preprocessed_collections.includes(item) && i >= collectionIndex);
                if (nextCollection != undefined && nextCollection != null) {
                    yield configsService.upsertSingleton({
                        unsplash_settings: Object.assign(Object.assign({}, updatePayload), { last_collection: nextCollection, last_collection_page: 1, preprocessed_collections: [...preprocessed_collections, last_collection], last_collection_total_pages: Math.round(parseInt(collectionsPhotosReq.headers["x-total"]) / items_per_page) })
                    });
                    return (0, exceptions_1.successMessage)(res, "moving to new collection");
                }
                else {
                    return (0, exceptions_1.throwError)(res, t("last_item_reached"));
                }
            }
            for (const imageData of collectionsPhotosReq.data) {
                try {
                    const image_url = (_a = imageData === null || imageData === void 0 ? void 0 : imageData.urls) === null || _a === void 0 ? void 0 : _a.small;
                    const base64 = yield imageToBase64(image_url);
                    const predictionReq = yield axios_1.default.post(`${process.env.TF_SERVING_API_URL}${model_path}`, { instances: [base64] });
                    const prediction = predictionReq.data.predictions[0];
                    const predictionData = {};
                    for (let i = 0; i < prediction.scores.length; i++) {
                        predictionData[prediction.classes[i]] = prediction.scores[i];
                    }
                    if (predictionData[neutral_class] <= neutral_class_danger_probability) {
                        yield feedbacksService.createOne({
                            image_url,
                            prediction_data: predictionData,
                            unsplash_collection: last_collection
                        });
                    }
                }
                catch (error) { }
            }
            yield configsService.upsertSingleton({ unsplash_settings: Object.assign(Object.assign({}, updatePayload), { last_collection_page: updatePayload.last_collection_page + 1 }) });
            return res.json(Object.assign(Object.assign({}, updatePayload), { api_key: null }));
        }
        catch (error) {
            console.log(error);
            return (0, exceptions_1.throwError)(res, t("we_encountered_an_unexpected_error_during_the_operation"));
        }
    }));
}
exports.default = default_1;
