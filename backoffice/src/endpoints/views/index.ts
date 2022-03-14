import { renderTemplate } from './../../helpers/template';
import { Router } from "express";
import { JsonObject } from "../../@types/global";

module.exports = (router: Router, { services, exceptions, getSchema, database, env }: JsonObject) => {
    router.get('/', async (req, res, next) => {  
        renderTemplate((textData: string)=>{
            res.send(textData)
        }, {title: "Testing out", headerText: "ok", content: "Nous testons les mails", btnText: "retourner à l'admin", btnUrl:"https://cryptomarket-ci.com"})
    }); 
};