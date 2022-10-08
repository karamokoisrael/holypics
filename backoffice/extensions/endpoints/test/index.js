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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
const utils_1 = require("../../helpers/utils");
const fs = require("fs");
const readline = require('readline');
function default_1(router, { database, emitter }) {
    router.get('/holypics-unsplash', (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { t } = yield (0, translation_1.getTranslator)(req, database);
        try {
            const { schema, accountability } = (0, request_handler_1.getRequestParams)(req, true);
            const { admin_id } = yield (0, auth_1.getAdminTokens)(database);
            const configsService = new directus_1.ItemsService("configurations", { schema, accountability: Object.assign(Object.assign({}, accountability), { user: admin_id }) });
            const configs = yield configsService.readSingleton({});
            const { api_key, preprocessed_collections, items_per_page, last_collection_page, collection_req_query, last_collection_req_page, last_collection_req_items_per_page, prediction_sleep_ttl } = configs.unsplash_settings;
            let { last_collection } = configs.unsplash_settings;
            const headers = { Authorization: `Client-ID ${api_key}` };
            const collectionsReq = yield axios_1.default.get(`https://api.unsplash.com/search/collections?page=${last_collection_req_page}&per_page=${last_collection_req_items_per_page}&query=${collection_req_query}`, { headers });
            const collections = collectionsReq.data.results.map((item) => item.id);
            if (last_collection == "")
                last_collection = collections[0];
            const collectionsPhotosReq = yield axios_1.default.get(`https://api.unsplash.com/collections/${last_collection}/photos?page=${last_collection_page}&per_page=${items_per_page}`, { headers });
            const updatePayload = configs.unsplash_settings;
            if (parseInt(collectionsPhotosReq.headers["x-total"]) < last_collection_page * items_per_page) {
                const collectionIndex = collections.findIndex(item => item == last_collection);
                const nextCollection = collections.find((item, i) => !preprocessed_collections.includes(item) && i >= collectionIndex);
                if (nextCollection != undefined && nextCollection != null) {
                    yield configsService.upsertSingleton({
                        unsplash_settings: Object.assign(Object.assign({}, updatePayload), { last_collection: nextCollection, last_collection_page: 1, preprocessed_collections: [...preprocessed_collections, last_collection], last_collection_total_pages: Math.round(parseInt(collectionsPhotosReq.headers["x-total"]) / items_per_page) })
                    });
                    yield axios_1.default.get(`${process.env.PUBLIC_URL}/test/holypics-unsplash`);
                    return (0, exceptions_1.successMessage)(res, "moving to new collection");
                }
                else {
                    return (0, exceptions_1.throwError)(res, t("last_item_reached"));
                }
            }
            for (const imageData of collectionsPhotosReq.data) {
                try {
                    const image_url = (_a = imageData === null || imageData === void 0 ? void 0 : imageData.urls) === null || _a === void 0 ? void 0 : _a.small;
                    emitter.emitAction("holypics_predict_url", { imageUrl: image_url }, {});
                    if (prediction_sleep_ttl != 0)
                        yield (0, utils_1.sleep)(prediction_sleep_ttl);
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
    router.get('/holypics-raw-data', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { t } = yield (0, translation_1.getTranslator)(req, database);
        try {
            const { schema, accountability } = (0, request_handler_1.getRequestParams)(req, true);
            const { admin_id } = yield (0, auth_1.getAdminTokens)(database);
            const configsService = new directus_1.ItemsService("configurations", { schema, accountability: Object.assign(Object.assign({}, accountability), { user: admin_id }) });
            const configs = yield configsService.readSingleton({});
            const { items_per_page, prediction_sleep_ttl } = configs.raw_data_settings;
            let { last_collection, last_collection_page, last_collection_total_pages } = configs.raw_data_settings;
            fs.readdir('./extensions/static/txt', (err, collections) => __awaiter(this, void 0, void 0, function* () {
                collections = collections.filter(item => ![".DS_Store"].includes(item));
                let count = 0;
                let processedCount = 0;
                const fileStream = fs.createReadStream(`./extensions/static/txt/${collections[last_collection]}`);
                const exec = require('child_process').exec;
                exec(`wc -l ./extensions/static/txt/${collections[last_collection]}`, function (error, total) {
                    var e_1, _a;
                    return __awaiter(this, void 0, void 0, function* () {
                        console.log(total);
                        if (error)
                            console.log(error);
                        if (error)
                            total = total;
                        console.log("processing collection => ", collections[last_collection]);
                        const readInterface = readline.createInterface({
                            input: fileStream,
                            crlfDelay: Infinity
                        });
                        try {
                            for (var readInterface_1 = __asyncValues(readInterface), readInterface_1_1; readInterface_1_1 = yield readInterface_1.next(), !readInterface_1_1.done;) {
                                const line = readInterface_1_1.value;
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
                                        emitter.emitAction("holypics_predict_url", { imageUrl: line }, {});
                                        if (prediction_sleep_ttl != 0)
                                            yield (0, utils_1.sleep)(prediction_sleep_ttl);
                                    }
                                }
                                catch (error) { }
                                finally {
                                    count++;
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (readInterface_1_1 && !readInterface_1_1.done && (_a = readInterface_1.return)) yield _a.call(readInterface_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        const updatePayload = configs.raw_data_settings;
                        updatePayload.last_collection_page = count;
                        updatePayload.last_collection = last_collection;
                        yield configsService.upsertSingleton({ raw_data_settings: updatePayload });
                    });
                });
            }));
            return res.json({});
        }
        catch (error) {
            console.log(error);
            return (0, exceptions_1.throwError)(res, t("we_encountered_an_unexpected_error_during_the_operation"));
        }
    }));
}
exports.default = default_1;
