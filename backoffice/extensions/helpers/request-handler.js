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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestParams = exports.translate = exports.getTranslations = exports.base64MimeType = exports.uploadBase64File = exports.httpResponseToJson = exports.httpRequest = exports.getUploadedFileUrl = exports.getConfigs = exports.customFetchWithCredentialsAndFiles = exports.customFetchWithCredentials = exports.customFetch = exports.customStringify = void 0;
const https_1 = __importDefault(require("https"));
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const utils_1 = require("./utils");
const stream_1 = require("stream");
const global_1 = require("../consts/global");
const customStringify = (query) => {
    return Object.keys(query).map(key => key + '=' + query.hasOwnProperty(key) ? query[key] : "").join('&');
};
exports.customStringify = customStringify;
const customFetch = (url, options = {}, xAccessToken = null, bearerToken = null) => {
    if (options.header == undefined) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    else {
        options.headers.set('Accept', 'application/json');
    }
    options.headers.set('Content-Type', 'application/json');
    options.headers.set('Access-Control-Allow-Credentials', true);
    options.headers.set('Access-Control-Expose-Headers', '*');
    options.headers.set('Access-Control-Allow-Origin', '*');
    options.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (xAccessToken != null) {
        options.headers.set('x-access-token', xAccessToken);
    }
    if (bearerToken != null) {
        options.headers.set('Authorization', `Bearer ${bearerToken}`);
    }
    const promise = fetch(url, options);
    return promise;
};
exports.customFetch = customFetch;
const customFetchWithCredentials = (url, bearerToken, options, loader = true, format = true) => {
    if (options.header == undefined) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    else {
        options.headers.set('Accept', 'application/json');
    }
    options.headers.set('Content-Type', 'application/json');
    options.headers.set('Access-Control-Allow-Credentials', true);
    options.headers.set('Access-Control-Expose-Headers', '*');
    options.headers.set('Access-Control-Allow-Origin', '*');
    options.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    options.headers.set('Authorization', `Bearer ${bearerToken}`);
    const promise = fetch(format ? url : url, options);
    return promise;
};
exports.customFetchWithCredentials = customFetchWithCredentials;
const customFetchWithCredentialsAndFiles = (url, bearerToken, files, fileNames, data = {}, method = "POST", loader = true) => {
    const options = {};
    options.headers = new Headers({});
    // options.headers.set('Content-Type', 'multipart/form-data'); 
    // options.headers.set('Accept', '*/*'); 
    // options.headers.set('Content-Type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'); 
    options.headers.set('Access-Control-Allow-Credentials', true);
    options.headers.set('Access-Control-Expose-Headers', '*');
    options.headers.set('Access-Control-Allow-Origin', '*');
    options.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    options.headers.set('Authorization', `Bearer ${bearerToken}`);
    options.method = method;
    const formData = new form_data_1.default();
    let count = 0;
    fileNames.forEach(fileName => {
        formData.append(fileName, files[count]);
        count++;
    });
    Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
    });
    console.log(formData);
    options.body = formData;
    const promise = fetch(url, options);
    return promise;
};
exports.customFetchWithCredentialsAndFiles = customFetchWithCredentialsAndFiles;
const getConfigs = (callback) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const configsRes = yield (0, exports.customFetch)(`Config/GetAll`);
        const currentConfigs = yield configsRes.json();
        callback(currentConfigs);
    }
    catch (error) {
        callback([]);
    }
});
exports.getConfigs = getConfigs;
const getUploadedFileUrl = (file) => {
    return `Uploads/${file}`;
};
exports.getUploadedFileUrl = getUploadedFileUrl;
const httpRequest = (url, method = 'GET', body = {}, headers = {}) => {
    const urlParams = new URL(url);
    const bodyString = JSON.stringify(body);
    const baseHeaders = {
        'Content-Type': 'application/json',
        'Content-Length': bodyString.length
    };
    const options = {
        hostname: urlParams.hostname,
        port: urlParams.port,
        path: urlParams.pathname,
        method: method,
        headers: Object.assign(Object.assign({}, baseHeaders), headers)
    };
    return new Promise((resolve, reject) => {
        const req = https_1.default.request(options, res => {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({ statusCode: res.statusCode, data });
            });
        });
        req.on('error', error => {
            console.log(error);
            reject(error);
        });
        if (method != "GET")
            req.write(bodyString);
        req.end();
    });
};
exports.httpRequest = httpRequest;
const httpResponseToJson = (response) => {
    return new Promise((resolve, reject) => {
        try {
            resolve(JSON.parse(response.data));
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.httpResponseToJson = httpResponseToJson;
const uploadBase64File = (req, base64, access_token = "", fileName = (0, uuid_1.v4)().toString()) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
            if ((matches === null || matches === void 0 ? void 0 : matches.length) !== 3) {
                return reject('Invalid input string');
            }
            const buffer = Buffer.from(matches[2], 'base64');
            const [mimeType] = (0, exports.base64MimeType)(base64);
            const form = new form_data_1.default();
            const stream = stream_1.Readable.from(buffer);
            form.append('title', fileName);
            form.append('file', stream, {
                filename: fileName,
                contentType: mimeType
            });
            const response = yield axios_1.default.post((0, utils_1.formatUrl)(req, `files?${access_token != "" ? "access_token=" + access_token : ""}`), form, {
                headers: Object.assign({}, form.getHeaders())
            });
            resolve(response.data);
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.uploadBase64File = uploadBase64File;
const base64MimeType = (encoded) => {
    let result = null;
    let extension = null;
    if (typeof encoded !== 'string') {
        return [result, extension];
    }
    let mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (mime && mime.length) {
        result = mime[1];
    }
    extension = result === null || result === void 0 ? void 0 : result.split("/")[1];
    return [result, extension];
};
exports.base64MimeType = base64MimeType;
const getTranslations = (req, accessToken) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get((0, utils_1.formatUrl)(req, `settings?fields[]=translation_strings&limit=-1&access_token=${accessToken}`));
            resolve(response.data);
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.getTranslations = getTranslations;
const translate = (translations, text, lang = global_1.DIRECTUS_DEFAULT_LANGUAGE) => {
    const foundTranslation = translations.data.translation_strings.find((item) => item.key == text.replace("$t:", ""));
    if (foundTranslation != null || foundTranslation != undefined) {
        try {
            return foundTranslation.translations[lang];
        }
        catch (error) {
            return text.replace("$t:", "").replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase());
        }
    }
    return text.replace("$t:", "").replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase());
};
exports.translate = translate;
const getRequestParams = (req, forceAdmin = false) => {
    // @ts-ignore
    const filters = req.query.filters;
    // @ts-ignore
    const accountability = req.accountability;
    // @ts-ignore
    if (forceAdmin)
        accountability.admin = true;
    // @ts-ignore
    const schema = req.schema;
    return { filters, accountability, schema };
};
exports.getRequestParams = getRequestParams;
