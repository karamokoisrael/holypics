import { Knex } from 'knex';
import { Request } from "express";
import { logInformation } from './logger';


const formatString = (text: string, params: any[] | null = null) => {
    if (params === null) return text;    
    return text.replace(/{(\d+)}/g, function (match, number) {
        return typeof params[number] != "undefined" ? params[number] : match;
    });
}
const getDefaultTranslation = (key: string, params: any[] | null = null) => formatString(key.replace(new RegExp(`_`, "g"), " "), params);
export const getTranslator = async (req: Request, database: any) => {
    let t = getDefaultTranslation;
    try {
        const [{ translation_strings }] = await database("directus_settings").select("translation_strings").limit(1);
        let lang = "fr-FR";
        const languagesHeader = req.query.culture !== undefined ? req.query.culture : req.headers["accept-language"] as string | undefined;
        switch (languagesHeader !== undefined ? (languagesHeader as string).split(",")[0].split("-")[0] : null) {
            case "en":
                lang = "en-US";
                break;
            default:
                lang = "fr-FR";
                break;
        }

        const tanslationStrings: Record<string, any>[] = translation_strings !== undefined && translation_strings !== null ? JSON.parse(translation_strings) : []
        t = (key: string, params: any[] | null = null) => {
            const tanslation = tanslationStrings.find((item) => item.key === key);
            if (tanslation === undefined || tanslation.translations[lang] === undefined) return getDefaultTranslation(key)
            return formatString(tanslation.translations[lang], params);
        }

    } catch (error) {
        logInformation(error, true);
    } finally {
        return t;
    }

}

