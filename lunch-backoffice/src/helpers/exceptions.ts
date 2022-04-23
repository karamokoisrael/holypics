import { DirectusBaseException, DirectusError } from './../@types/exception';
import { Knex } from 'knex';
import { Response, Request } from "express";
import { renderTemplate } from "./template";
import { getHost } from "./utils";
import { DEFAULT_ERROR_MESSAGE, ERROR_MESSAGES } from '../consts/global';
import { BaseException } from '@directus/shared/exceptions';

export const successMessage = (res: Response, message="Opération effectuée avec succès", additionalObject={})=>{
    return res.status(200).send(
        {
            "message": message,
            ...additionalObject
        }
    )
}

export const responseWithSingleKey = (res: Response, key: string | number, value: any)=>{
    const data:Record<string | number, any> = {};
    data[key]=value;

    return res.status(200).send(data)
}

export const responseWithId = (res: Response, id: string | null)=>{
    return responseWithSingleKey(res, "id", id);
}

export const throwError = (res: Response, message=DEFAULT_ERROR_MESSAGE, statusCode=500)=>{
    return res.status(statusCode).send(
        generateError(message, statusCode)
    )
}

export const generateError = (message=DEFAULT_ERROR_MESSAGE, statusCode=500): DirectusError=>{
    let errorCode = "";
    
    switch (statusCode) {
        case 500:
            errorCode = "INTERNAL_SERVER_ERROR";
            break;
        
        case 400:
            errorCode = "BAD_REQUEST";
            break;

        case 409:
            errorCode = "CONFLICT";
            break;
        
        case 403:
            errorCode = "FORBIDDEN";
            break;
            
        default:
            errorCode = "CONFLICT";
            break;
    }
    return  {
        "errors": [
            {
                "message": message,
                "extensions": {
                    "code": errorCode
                }
            }
        ]
    }
}

export const getBaseExceptionParams = (message=DEFAULT_ERROR_MESSAGE, code="INTERNAL_SERVER_ERROR"): DirectusBaseException=>{
    const { statusCode, key } = getErrorMessage(code);
    return {message: message, status: statusCode, code: key, extensions: {code: code}}
} 

export const throwErrorWithCode =  (res: Response, givenMessage=DEFAULT_ERROR_MESSAGE, givenCode="INTERNAL_SERVER_ERROR")=>{
    const { message, status, code, extensions } = getBaseExceptionParams(givenMessage, givenCode)

    res.status(status).send({
        "errors": [
            {
                "message": givenMessage,
                "extensions": {
                    "code": givenCode
                }
            }
        ]
    })
    
    throw new BaseException( givenMessage, status, givenCode, extensions)
}

export const throwBaseException = (givenMessage=DEFAULT_ERROR_MESSAGE, givenCode="INTERNAL_SERVER_ERROR")=>{
    const { message, status, code, extensions } = getBaseExceptionParams(givenMessage, givenCode)
    throw new BaseException( givenMessage, status, givenCode, extensions)
}

export const throwErrorMessage = (res: Response, code:string, customMessage?: string)=>{

    const { message, statusCode, key } = getErrorMessage(code);
    
    return res.status(statusCode).send(
        {
            "errors": [
                {
                    "message": customMessage != undefined ? customMessage: message,
                    "extensions": {
                        "code": key
                    }
                }
            ]
        }
    )
}

export const getErrorMessage  = (code:string)=>{
    const key = Object.keys(ERROR_MESSAGES).includes(code) ? code : "INTERNAL_SERVER_ERROR";
    return {...ERROR_MESSAGES[key], key: key}
}

export const throwJsonError = (res: Response, resJson: any): any | null=>{
    return throwError(res, resJson.message, resJson.statusCode);
}

export const throwViewError = (req: Request, res: Response, lang = "intl", database: Knex| null =null, title="Erreur 404", headerText="Erreur", statusCode=404, content="Vous essayez d'accéder à une page inexistente ou supprimée", btnText="Retourner à l'accueil", btnUrl=getHost(req))=>{
    renderTemplate(req, res, 
        {title, headerText, statusCode, content, btnText, btnUrl},
        "error", "liquid", lang, database);
}

