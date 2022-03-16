"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTemplate = exports.getTemplate = void 0;
const liquidjs_1 = require("liquidjs");
const fs = require("fs");
const getTemplate = (fileName, callback) => {
    fs.readFile(`./extensions/templates/${fileName}`, "utf8", function (error, textData) {
        callback({ textData: textData, error: error });
    });
};
exports.getTemplate = getTemplate;
const renderTemplate = (type = "liquid", data, fileName = "custom", lang = "intl") => __awaiter(void 0, void 0, void 0, function* () {
    const availableLanguages = ["intl", "en-US"];
    if (!availableLanguages.includes(lang))
        lang = availableLanguages[1];
    switch (type) {
        case "liquid":
            (0, exports.getTemplate)(`${lang}/${fileName}.${type}`, ({ textData, error }) => {
                const engine = new liquidjs_1.Liquid();
                const tpl = engine.parse(textData);
                return engine.render(tpl, data);
            });
        default:
            return new Promise((resolve, reject) => {
                reject("failure");
            });
            break;
    }
});
exports.renderTemplate = renderTemplate;
