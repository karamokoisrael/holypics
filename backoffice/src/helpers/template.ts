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

export const renderTemplate = async (callBack: Function=()=>{}, data: Record<string, any>={},fileName="default", type="html", lang = "intl"): Promise<any>=>{
    // const availableLanguages = [ "intl", "en-US"];
    // if(!availableLanguages.includes(lang)) lang =  availableLanguages[1];
    getTemplate(`${type}/${lang}/${fileName}.${type}`, async ({textData, error} : templateValue)=>{
        Object.keys(data).forEach(key => {
            textData = textData.replace(new RegExp(`{{${key}}}`,"g"), data[key]); 
        });
        callBack(textData)   
    })
}