"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = void 0;
const random = (length, type = "*") => {
    let result = '';
    let characters = '';
    switch (type) {
        case "number":
            characters = '0123456789';
            break;
        case "alphanum":
            characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
            break;
        default:
            characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            break;
    }
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.random = random;
