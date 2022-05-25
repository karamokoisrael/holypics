"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwViewError = exports.throwJsonError = exports.getErrorMessage = exports.throwErrorMessage = exports.throwBaseException = exports.throwErrorWithCode = exports.getBaseExceptionParams = exports.generateError = exports.throwError = exports.responseWithId = exports.responseWithSingleKey = exports.successMessage = void 0;
const template_1 = require("./template");
const utils_1 = require("./utils");
const global_1 = require("../consts/global");
const exceptions_1 = require("@directus/shared/exceptions");
const successMessage = (res, message = "Opération effectuée avec succès", additionalObject = {}) => {
    return res.status(200).send(Object.assign({ message, data: [] }, additionalObject));
};
exports.successMessage = successMessage;
const responseWithSingleKey = (res, key, value) => {
    const data = {};
    data[key] = value;
    return res.status(200).send(data);
};
exports.responseWithSingleKey = responseWithSingleKey;
const responseWithId = (res, id) => {
    return (0, exports.responseWithSingleKey)(res, "id", id);
};
exports.responseWithId = responseWithId;
const throwError = (res, message = global_1.DEFAULT_ERROR_MESSAGE, statusCode = 500) => {
    return res.status(statusCode).send((0, exports.generateError)(message, statusCode));
};
exports.throwError = throwError;
const generateError = (message = global_1.DEFAULT_ERROR_MESSAGE, statusCode = 500) => {
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
    return {
        "errors": [
            {
                "message": message,
                "extensions": {
                    "code": errorCode
                }
            }
        ]
    };
};
exports.generateError = generateError;
const getBaseExceptionParams = (message = global_1.DEFAULT_ERROR_MESSAGE, code = "INTERNAL_SERVER_ERROR") => {
    const { statusCode, key } = (0, exports.getErrorMessage)(code);
    return { message: message, status: statusCode, code: key, extensions: { code: code } };
};
exports.getBaseExceptionParams = getBaseExceptionParams;
const throwErrorWithCode = (res, givenMessage = global_1.DEFAULT_ERROR_MESSAGE, givenCode = "INTERNAL_SERVER_ERROR") => {
    const { message, status, code, extensions } = (0, exports.getBaseExceptionParams)(givenMessage, givenCode);
    res.status(status).send({
        "errors": [
            {
                "message": givenMessage,
                "extensions": {
                    "code": givenCode
                }
            }
        ]
    });
    throw new exceptions_1.BaseException(givenMessage, status, givenCode, extensions);
};
exports.throwErrorWithCode = throwErrorWithCode;
const throwBaseException = (givenMessage = global_1.DEFAULT_ERROR_MESSAGE, givenCode = "INTERNAL_SERVER_ERROR") => {
    const { message, status, code, extensions } = (0, exports.getBaseExceptionParams)(givenMessage, givenCode);
    throw new exceptions_1.BaseException(givenMessage, status, givenCode, extensions);
};
exports.throwBaseException = throwBaseException;
const throwErrorMessage = (res, code, customMessage) => {
    const { message, statusCode, key } = (0, exports.getErrorMessage)(code);
    return res.status(statusCode).send({
        "errors": [
            {
                "message": customMessage != undefined ? customMessage : message,
                "extensions": {
                    "code": key
                }
            }
        ]
    });
};
exports.throwErrorMessage = throwErrorMessage;
const getErrorMessage = (code) => {
    const key = Object.keys(global_1.ERROR_MESSAGES).includes(code) ? code : "INTERNAL_SERVER_ERROR";
    return Object.assign(Object.assign({}, global_1.ERROR_MESSAGES[key]), { key: key });
};
exports.getErrorMessage = getErrorMessage;
const throwJsonError = (res, resJson) => {
    return (0, exports.throwError)(res, resJson.message, resJson.statusCode);
};
exports.throwJsonError = throwJsonError;
const throwViewError = (req, res, lang = "intl", database = null, title = "Erreur 404", headerText = "Erreur", statusCode = 404, content = "Vous essayez d'accéder à une page inexistente ou supprimée", btnText = "Retourner à l'accueil", btnUrl = (0, utils_1.getHost)(req)) => {
    (0, template_1.renderTemplate)(req, res, { title, headerText, statusCode, content, btnText, btnUrl }, "error", "liquid", lang, database);
};
exports.throwViewError = throwViewError;
