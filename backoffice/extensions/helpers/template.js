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
const utils_1 = require("./utils");
const liquidjs_1 = require("liquidjs");
const exceptions_1 = require("./exceptions");
const validation_1 = require("./validation");
const uuid_1 = require("uuid");
const fs = require("fs");
const ejs = require('ejs');
const getTemplate = (fileName, callback) => {
    fs.readFile(`./extensions/templates/${fileName}`, "utf8", function (error, textData) {
        callback({ textData: textData, error: error });
    });
};
exports.getTemplate = getTemplate;
const renderTemplate = (req, res, data = {}, fileName = "default", type = "html", lang = "intl", database = null) => __awaiter(void 0, void 0, void 0, function* () {
    const nonce = (0, uuid_1.v4)();
    if (database != null) {
        const [settings] = yield database('directus_settings');
        const [appSettings] = yield database('configurations');
        data = Object.assign(Object.assign(Object.assign(Object.assign({}, settings), appSettings), { project_url: process.env.NODE_ENV != "production" || settings.project_url != null || settings.project_url != undefined || !(0, validation_1.isValidURL)(settings.project_url) ?
                (0, utils_1.getHost)(req)
                :
                    settings.project_url }), data);
    }
    data.nonce = nonce;
    (0, exports.getTemplate)(`${type}/${lang}/${fileName}.${type}`, ({ textData, error }) => __awaiter(void 0, void 0, void 0, function* () {
        let unexpectedError = false;
        try {
            switch (type) {
                case "liquid":
                    const engine = new liquidjs_1.Liquid();
                    const tpl = engine.parse(textData);
                    try {
                        textData = yield engine.render(tpl, data);
                    }
                    catch (error) {
                        (0, exceptions_1.throwViewError)(req, res, lang);
                    }
                    break;
                case "ejs":
                    textData = ejs.render(textData, data);
                    break;
                default:
                    Object.keys(data).forEach(key => {
                        textData = textData.replace(new RegExp(`{{${key}}}`, "g"), data[key]).replace(new RegExp(`{{ ${key} }}`, "g"), data[key]);
                    });
                    break;
            }
            if (textData != null && textData != undefined) {
                res.header('Content-Type', 'text/html');
                res.header('Content-Security-Policy', `script-src 'self' 'unsafe-inline' 'unsafe-eval'`);
                res.send(textData);
            }
            else {
                unexpectedError = true;
            }
        }
        catch (error) {
            console.log(error);
            unexpectedError = true;
        }
        if (unexpectedError) {
            (0, exceptions_1.throwViewError)(req, res, lang);
        }
    }));
});
exports.renderTemplate = renderTemplate;
