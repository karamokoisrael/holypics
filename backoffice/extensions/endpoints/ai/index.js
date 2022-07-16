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
const ai_1 = require("./../../helpers/ai");
const exceptions_1 = require("./../../helpers/exceptions");
const endpoints_1 = require("../../helpers/endpoints");
const translation_1 = require("../../helpers/translation");
const body_parser_1 = __importDefault(require("body-parser"));
const imageToBase64 = require('image-to-base64');
const multer = require('multer');
function default_1(router, { database }) {
    router.use(body_parser_1.default.json());
    // in latest body-parser use like below.
    router.use(body_parser_1.default.urlencoded({ extended: true }));
    // router.use(expressFormidable());
    router.post('/predict/:model', multer().single('file'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const t = yield (0, translation_1.getTranslator)(req, database);
        try {
            const reqBody = req.body;
            let base64Image = "";
            const modelData = yield (0, endpoints_1.getConfigs)(database, req.params.model);
            if (modelData.id == undefined)
                return (0, exceptions_1.throwError)(res, t("we_encountered_an_unexpected_error_during_the_operation"), 400);
            const file = (_b = (_a = req) === null || _a === void 0 ? void 0 : _a.file) === null || _b === void 0 ? void 0 : _b.buffer;
            const getBaseImageBack = reqBody.get_image_back !== undefined && Boolean(reqBody.get_image_back) == true;
            if (file !== undefined) {
                const base64 = file.toString('base64');
                base64Image = `data:image/jpg;base64,${base64}`;
            }
            else if (reqBody.base64_image !== undefined) {
                const splitted = reqBody.base64_image.split(",");
                const base64 = splitted[splitted.length - 1];
                base64Image = `data:image/jpg;base64,${base64}`;
            }
            else if (reqBody.url !== undefined) {
                const base64 = yield imageToBase64(reqBody.url);
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
            const prediction = yield (0, ai_1.predict)(modelData, base64Image, getBaseImageBack, t);
            res.json({ data: prediction });
        }
        catch (error) {
            console.log("handled error => ", error);
            return (0, exceptions_1.throwError)(res, t("we_encountered_an_unexpected_error_during_the_operation"));
        }
    }));
}
exports.default = default_1;
