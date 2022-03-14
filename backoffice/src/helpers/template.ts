import { Liquid } from 'liquidjs'
import { JsonObject } from '../@types/global';
const fs = require("fs");

type templateValue = {
    textData: string
    error: Error
}
export const getTemplate = (fileName: string, callback: Function)=> {
    fs.readFile(`./extensions/templates/${fileName}`, "utf8", function(error: Error, textData: string) {
        callback({textData: textData, error: error})
    });
}
export const renderTemplate = async (type="liquid", data: JsonObject, fileName="custom", lang = "intl"): Promise<any>=>{
    const availableLanguages = [ "intl", "en-US"];
    if(!availableLanguages.includes(lang)) lang =  availableLanguages[1];

    
    switch (type) {
        case "liquid":
            getTemplate(`${lang}/${fileName}.${type}`, ({textData, error} : templateValue)=>{
                const engine = new Liquid()
                const tpl = engine.parse(textData);
                return engine.render(tpl, data)
            })
        default:
            return new Promise<any>((resolve, reject) => {
                reject("failure")
            });
        break;
    }
}