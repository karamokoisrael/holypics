import { Request } from "express";
import { logInformation } from './logger';
import { getCacheValue, setCacheValue, createCache } from './cache';
import { TRANSLATIONS_CACHE_KEY } from '../consts/global';


const formatString = (text: string, params: any[] | null = null) => {
    if (params === null) return text;
    return text.replace(/{(\d+)}/g, function (match, number) {
        return typeof params[number] != "undefined" ? params[number] : match;
    });
}
const getDefaultTranslation = (key: string, params: any[] | null = null) => formatString(key.replace(new RegExp(`_`, "g"), " "), params);

const getTranslationStrings = async (database: any) => {
    const [{ translation_strings }] = await database("directus_settings").select("translation_strings").limit(1);
    const cache = createCache();
    if (!cache.has(TRANSLATIONS_CACHE_KEY)) {
        setCacheValue(TRANSLATIONS_CACHE_KEY, translation_strings);
    }
    return translation_strings !== undefined && translation_strings !== null ? JSON.parse(translation_strings) : []
}

const getLanguage = (req: Request) => {
    const baseLanguage = "en-US";
    let lang = baseLanguage;
    const languagesHeader = req.query.culture !== undefined ? req.query.culture : req.headers["accept-language"] as string | undefined;
    switch (languagesHeader !== undefined ? (languagesHeader as string).split(",")[0].split("-")[0] : null) {
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
}

export const getTranslator = async (req: Request, database: any) => {
    let t = getDefaultTranslation;
    const lang = getLanguage(req);
    let translationStrings: Record<string, any>[] = [];
    try {

        const cachedTranslationStrings = getCacheValue<string>(TRANSLATIONS_CACHE_KEY);
        if (cachedTranslationStrings != null && cachedTranslationStrings != undefined) {
            translationStrings = cachedTranslationStrings !== undefined && cachedTranslationStrings !== null ? JSON.parse(cachedTranslationStrings) : []
            console.log("cache loaded");
        } else {
            translationStrings = await getTranslationStrings(database);
            console.log("no cache loaded");
        }

        t = (key: string, params: any[] | null = null) => {
            const tanslation = translationStrings.find((item: any) => item.key === key);
            if (tanslation === undefined || tanslation.translations[lang] === undefined) return getDefaultTranslation(key)
            return formatString(tanslation.translations[lang], params);
        }

    } catch (error) {
        logInformation(error, true);
    } finally {
        return { t, lang };
    }

}

