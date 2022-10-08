"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.formatUrl = exports.objectToCamelCase = exports.getHost = void 0;
const lodash_1 = __importDefault(require("lodash"));
const getHost = (req, type = "hostUrl") => {
    let output = req.get('host');
    if (type == "hostUrl" || type == "full") {
        output = req.protocol + '://' + output;
    }
    if (type == "full") {
        output += req.originalUrl;
    }
    return output;
};
exports.getHost = getHost;
const objectToCamelCase = (object) => {
    const newObject = {};
    Object.keys(object).forEach((key) => {
        newObject[lodash_1.default.camelCase(key)] = object[key];
    });
    return newObject;
};
exports.objectToCamelCase = objectToCamelCase;
const formatUrl = (req, url) => {
    return `${(0, exports.getHost)(req)}/${url}`;
};
exports.formatUrl = formatUrl;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.sleep = sleep;
