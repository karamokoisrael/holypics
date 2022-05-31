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
Object.defineProperty(exports, "__esModule", { value: true });
const request_handler_1 = require("./../../helpers/request-handler");
const exceptions_1 = require("./../../helpers/exceptions");
const directus_1 = require("directus");
const fs = require('fs');
const AdmZip = require("adm-zip");
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
            console.log(dataset.prediction_models);
            // const modelsData = await database("models").whereIn("id", dataset.prediction_models);
            // console.log(modelsData);
            // for (let i = 0; i < modelsData.length; i++) {
            //         const [file] = await database("directus_files").where({ id: modelsData[i].tfjs_file })
            //         const modelDataPath = `./uploads/tmp/${file.id}`;
            //         if (!fs.existsSync(modelDataPath)) {
            //                 fs.mkdirSync(modelDataPath);
            //                 const zipFile = new AdmZip(`./uploads/${file.id}.zip`);
            //                 zipFile.extractAllTo(modelDataPath, true);
            //         }  
            //         const baseUrl = `${host}/file/tmp/download?path=${file.id}`             
            //         const modelJsonUrl = `${baseUrl}/model.json`
            //         const modelWeightsUrl = `${host}/file/${modelDataPath.replace("./", "")}/group1-shard1of3.bin`
            //         const model =  await tf.loadLayersModel(
            //                 // "https://storage.googleapis.com/tfjs-models/tfjs/iris_v1/model.json"
            //                 modelJsonUrl
            //         );
            //         console.log(model.summary());
            // }
            // dataset.prediction_models = modelsData;
            return res.json({ data: dataset });
        }
        catch (error) {
            console.log(error);
            return (0, exceptions_1.throwError)(res);
        }
    }));
    router.get('/ok', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            return res.json({});
        }
        catch (error) {
            console.log(error);
            return (0, exceptions_1.throwError)(res);
        }
    }));
}
exports.default = default_1;
