"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwJsonError = exports.throwError = exports.successMessage = void 0;
const successMessage = (res, message = "Opération effectuée avec succès") => {
    return res.status(200).send({
        "message": message,
    });
};
exports.successMessage = successMessage;
const throwError = (res, message = "Nous avons rencontré une erreur lors de l'opération.", statusCode = 500) => {
    let errorCode = "";
    switch (statusCode) {
        case 500:
            errorCode = "INTERNAL_SERVER_ERROR";
            break;
        case 400:
            errorCode = "CONFLICT";
            break;
        default:
            errorCode = "CONFLICT";
            break;
    }
    return res.status(statusCode).send({
        "errors": [
            {
                "message": message,
                "extensions": {
                    "code": errorCode
                }
            }
        ]
    });
};
exports.throwError = throwError;
const throwJsonError = (res, resJson) => {
    return (0, exports.throwError)(res, resJson.message, resJson.statusCode);
};
exports.throwJsonError = throwJsonError;
