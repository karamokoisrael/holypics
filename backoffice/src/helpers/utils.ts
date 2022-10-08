import { Request } from 'express';
import _ from "lodash";

export const getHost =  (req: Request, type="hostUrl")=>{
    let output = req.get('host');

    if(type == "hostUrl" || type == "full"){
        output = req.protocol + '://'+ output;      
    }

    if(type == "full"){
        output += req.originalUrl;
    }

    return output;
};

export const objectToCamelCase = (object: Record<string, any>)=> {
    const newObject:Record<string, any> = {};
    Object.keys(object).forEach((key)=>{
        newObject[_.camelCase(key)] = object[key];
    })
    return newObject;
}

export const formatUrl = (req:Request, url: string)=>{
    return `${getHost(req)}/${url}`;
}

export const sleep: (ms: number) => Promise<void> = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));