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
const cache_1 = require("./cache");
const global_1 = require("../consts/global");
const formatString = (text, params = null) => {
    if (params === null)
        return text;
    return text.replace(/{(\d+)}/g, function (match, number) {
        return typeof params[number] != "undefined" ? params[number] : match;
    });
};
const getDefaultTranslation = (key, params = null) => formatString(key.replace(new RegExp(`_`, "g"), " "), params);
const getTranslationStrings = (database) => __awaiter(void 0, void 0, void 0, function* () {
    const [{ translation_strings }] = yield database("directus_settings").select("translation_strings").limit(1);
    const cache = (0, cache_1.createCache)();
    if (!cache.has(global_1.TRANSLATIONS_CACHE_KEY)) {
        (0, cache_1.setCacheValue)(global_1.TRANSLATIONS_CACHE_KEY, translation_strings);
    }
    return translation_strings !== undefined && translation_strings !== null ? JSON.parse(translation_strings) : [];
});
const getLanguage = (req) => {
    const baseLanguage = "en-US";
    let lang = baseLanguage;
    const languagesHeader = req.query.culture !== undefined ? req.query.culture : req.headers["accept-language"];
    switch (languagesHeader !== undefined ? languagesHeader.split(",")[0].split("-")[0] : null) {
        case "en":
            lang = "en-US";
            break;
        case "fr":
            lang = "fr-FR";
            break;
        default:
            break;
    }
    return lang;
};
const getTranslator = (req, database) => __awaiter(void 0, void 0, void 0, function* () {
    let t = getDefaultTranslation;
    const lang = getLanguage(req);
    let translationStrings = [];
    try {
        const cachedTranslationStrings = (0, cache_1.getCacheValue)(global_1.TRANSLATIONS_CACHE_KEY);
        if (cachedTranslationStrings != null && cachedTranslationStrings != undefined) {
            translationStrings = cachedTranslationStrings !== undefined && cachedTranslationStrings !== null ? JSON.parse(cachedTranslationStrings) : [];
            console.log("cache loaded");
        }
        else {
            translationStrings = yield getTranslationStrings(database);
            console.log("no cache loaded");
        }
        t = (key, params = null) => {
            const tanslation = translationStrings.find((item) => item.key === key);
            if (tanslation === undefined || tanslation.translations[lang] === undefined)
                return getDefaultTranslation(key);
            return formatString(tanslation.translations[lang], params);
        };
    }
    catch (error) {
        (0, logger_1.logInformation)(error, true);
    }
    finally {
        return { t, lang };
    }
});
exports.getTranslator = getTranslator;
