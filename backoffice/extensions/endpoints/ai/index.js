"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_handler_1 = require("./../../helpers/request-handler");
const exceptions_1 = require("./../../helpers/exceptions");
const directus_1 = require("directus");
const fs = require('fs');
const AdmZip = require("adm-zip");
const tf = __importStar(require("@tensorflow/tfjs-node"));
const utils_1 = require("../../helpers/utils");
function default_1(router, { services, exceptions, getSchema, database, env }) {
    router.post('/predict/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const host = (0, utils_1.getHost)(req);
            const { accountability, schema } = (0, request_handler_1.getRequestParams)(req);
            const itemsService = new directus_1.ItemsService('datasets', { knex: database, accountability, schema });
            const [dataset] = yield itemsService.readByQuery({
                filter: { name: { _eq: req.params.id } },
                limit: 1
            });
            const modelsData = yield database("models").whereIn("id", dataset.prediction_models);
            for (let i = 0; i < modelsData.length; i++) {
                const [file] = yield database("directus_files").where({ id: modelsData[i].tfjs_file });
                const modelDataPath = `./uploads/tmp/${file.id}`;
                if (!fs.existsSync(modelDataPath)) {
                    fs.mkdirSync(modelDataPath);
                    const zipFile = new AdmZip(`./uploads/${file.id}.zip`);
                    zipFile.extractAllTo(modelDataPath, true);
                }
                const baseUrl = `${host}/file/tmp/download?path=${file.id}`;
                const modelJsonUrl = `${baseUrl}/model.json`;
                const modelWeightsUrl = `${host}/file/${modelDataPath.replace("./", "")}/group1-shard1of3.bin`;
                const model = yield tf.loadLayersModel(
                // "https://storage.googleapis.com/tfjs-models/tfjs/iris_v1/model.json"
                modelJsonUrl);
                console.log(model.summary());
            }
            dataset.prediction_models = modelsData;
            return res.json({ data: dataset });
        }
        catch (error) {
            console.log(error);
            return (0, exceptions_1.throwError)(res);
        }
    }));
}
exports.default = default_1;
