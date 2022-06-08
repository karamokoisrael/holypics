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
const ai_1 = require("./../../helpers/ai");
const auth_1 = require("./../../helpers/auth");
const exceptions_1 = require("./../../helpers/exceptions");
const endpoints_1 = require("../../helpers/endpoints");
const formidable = require('express-formidable');
const imageToBase64 = require('image-to-base64');
function default_1(router, { database }) {
    // in latest body-parser use like below.
    // router.use(bodyParser.urlencoded({ extended: true }));
    router.use(formidable());
    router.post('/predict/:model', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const reqBody = req.fields;
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
                    // "8991200",
                    // "5052004"
                ];
                // Math.floor(Math.random() * (max - min + 1)) + min;
                const randomImageUrl = `https://source.unsplash.com/collection/${Math.floor(Math.random() * collections.length - 1)}`;
                const base64 = yield imageToBase64(randomImageUrl);
                base64Image = `data:image/jpg;base64,${base64}`;
            }
            const prediction = yield (0, ai_1.predict)(dataset, base64Image);
            if (prediction.id === null)
                throw new Error(`Error while prediction`);
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
