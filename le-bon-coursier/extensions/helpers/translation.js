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
exports.getTranslator = void 0;
const logger_1 = require("./logger");
const formatString = (text, params = null) => {
    if (params === null)
        return text;
    return text.replace(/{(\d+)}/g, function (match, number) {
        return typeof params[number] != "undefined" ? params[number] : match;
    });
};
const getDefaultTranslation = (key, params = null) => formatString(key.replace(new RegExp(`_`, "g"), " "), params);
const getTranslator = (req, database) => __awaiter(void 0, void 0, void 0, function* () {
    let t = getDefaultTranslation;
    try {
        const [{ translation_strings }] = yield database("directus_settings").select("translation_strings").limit(1);
        let lang = "fr-FR";
        const languagesHeader = req.query.culture !== undefined ? req.query.culture : req.headers["accept-language"];
        switch (languagesHeader !== undefined ? languagesHeader.split(",")[0].split("-")[0] : null) {
            case "en":
                lang = "en-US";
                break;
            default:
                lang = "fr-FR";
                break;
        }
        const tanslationStrings = translation_strings !== undefined && translation_strings !== null ? JSON.parse(translation_strings) : [];
        t = (key, params = null) => {
            const tanslation = tanslationStrings.find((item) => item.key === key);
            if (tanslation === undefined || tanslation.translations[lang] === undefined)
                return getDefaultTranslation(key);
            return formatString(tanslation.translations[lang], params);
        };
    }
    catch (error) {
        (0, logger_1.logInformation)(error, true);
    }
    finally {
        return t;
    }
});
exports.getTranslator = getTranslator;
