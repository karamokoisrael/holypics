import { Response } from "express";

export const successMessage = (res: Response, message="Opération effectuée avec succès")=>{
    return res.status(200).send(
        {
            "message": message,
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

export const throwError = (res: Response, message="Nous avons rencontré une erreur lors de l'opération.", statusCode=500)=>{
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
            
        default:
            errorCode = "CONFLICT";
            break;
    }

    return res.status(statusCode).send(
        {
            "errors": [
                {
                    "message": message,
                    "extensions": {
                        "code": errorCode
                    }
                }
            ]
        }
    )
}

export const throwJsonError = (res: Response, resJson: any): any | null=>{
    return throwError(res, resJson.message, resJson.statusCode);
}
