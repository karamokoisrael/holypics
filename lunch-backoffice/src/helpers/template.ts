import { getHost } from './utils';
import { AppSettings } from './../@types/global';
import { Liquid } from 'liquidjs'
import { Response, Request } from "express";
import { throwViewError } from './exceptions';
import { Knex } from 'knex';
import { isValidURL } from './validation';
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

export const renderTemplate = async (req: Request, res: Response, data: Record<string, any>={}, fileName="default", type="html", lang = "intl", database: Knex | null=null)=>{
    
    if(database != null) {
        const [ settings ] = await database('directus_settings');
        const [ appSettings ] = await database<AppSettings>('configurations');
        data = {...settings, ...appSettings, project_url: 
            settings.product_url != null || settings.product_url != undefined || !isValidURL(settings.product_url) ? 
                getHost(req)
            :
            settings.product_url
            , ...data}
        
    }
    
    getTemplate(`${type}/${lang}/${fileName}.${type}`, async ({textData, error} : templateValue)=>{
        let unexpectedError = false;
        try {
            switch(type){
                case "liquid":
                    const engine = new Liquid()
                    const tpl = engine.parse(textData)
                    try {
                        textData = await engine.render(tpl, data);
                    } catch (error) {
                        throwViewError(req, res, lang);
                    } 
                    break;
                default:
                    Object.keys(data).forEach(key => {
                        textData = textData.replace(new RegExp(`{{${key}}}`,"g"), data[key]).replace(new RegExp(`{{ ${key} }}`,"g"), data[key]); 
                    });
                    break;
            }
            
            if(textData != null && textData != undefined){
                res.header('Content-Type', 'text/html');
                res.send(textData); 
            }else{
                unexpectedError = true;
            }  

        } catch (error) {
            unexpectedError = true;
        } 

        if(unexpectedError){
            throwViewError(req, res, lang);
        }
    })
}