"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logInformation = void 0;
const logInformation = (text, onlyDev = false) => {
    if (onlyDev && process.env.NODE_ENV === "production")
        return;
    console.log(text);
};
exports.logInformation = logInformation;
