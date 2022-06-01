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
function default_1(router, { database }) {
    router.post('/predict/:model', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const prediction = {};
            let base64Image = "";
            const configs = yield (0, endpoints_1.getConfigs)(database);
            const dataset = configs.datasets.find((item) => item.name == req.params.model);
            if (dataset === null || dataset === undefined)
                return (0, exceptions_1.throwError)(res, "Veuillez sélectionner un dataset valide", 400);
            if (req.body.base64Image !== undefined) {
                base64Image = req.body.base64Image;
            }
            else {
                return (0, exceptions_1.throwError)(res, "Veuillez sélectionner une image valide", 400);
            }
            for (const productionModel of dataset.production_models) {
                const res = yield axios_1.default.post(`${process.env.TF_SERVING_API_URL}/v${productionModel.model.version}/models/${productionModel.model.name}:predict`, {
                    instances: [base64Image]
                });
                if (res.data.predictions === undefined || res.data.predictions.length === 0 || res.data.predictions[0].length === 0)
                    throw new Error(`Error while prediction ${productionModel.model.name}`);
                prediction[productionModel.model.name] = res.data.predictions[0][0];
            }
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
