"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPropertyEmpty = exports.isValidURL = exports.getJoiError = void 0;
const getJoiError = (validationResult, defaultErrorMessage = "Nous avons rencontré une erreur inattendue lors de l'opération") => {
    try {
        //@ts-ignore
        return validationResult.error.details[0].context.label;
    }
    catch (error) {
        return defaultErrorMessage;
    }
};
exports.getJoiError = getJoiError;
const isValidURL = (string) => {
    try {
        const res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        return (res !== null);
    }
    catch (error) {
        return false;
    }
};
exports.isValidURL = isValidURL;
const isPropertyEmpty = (object, prop) => {
    try {
        if (object == null || object == undefined || object == "")
            return true;
        const item = object[prop];
        return item == undefined || item == null || item == "";
    }
    catch (error) {
        return true;
    }
};
exports.isPropertyEmpty = isPropertyEmpty;
