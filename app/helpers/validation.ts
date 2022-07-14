import { ValidationResult } from "joi";

export const getJoiError = (validationResult: ValidationResult, defaultErrorMessage="Nous avons rencontré une erreur inattendue lors de l'opération")=>{
    try {
        //@ts-ignore
        return validationResult.error.details[0].context.label
    } catch (error) {
        return defaultErrorMessage;
    }
}

export const isValidURL = (string: string)=>{
    try {
        const res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        return (res !== null)
    } catch (error) {
        return false
    }
    
};