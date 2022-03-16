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
exports.sendSocketMessage = exports.deserializeSocketMessage = exports.serializeSocketMessage = exports.getUploadedFileUrl = exports.getConfigs = exports.customFetchWithCredentialsAndFiles = exports.customFetchWithCredentials = exports.customFetch = exports.customStringify = void 0;
const customStringify = (query) => {
    return Object.keys(query).map(key => key + '=' + query.hasOwnProperty(key) ? query[key] : "").join('&');
};
exports.customStringify = customStringify;
const customFetch = (url, options = {}, loader = true) => {
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
    const formData = new FormData();
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
//web Socket
const serializeSocketMessage = (json) => JSON.stringify(json);
exports.serializeSocketMessage = serializeSocketMessage;
const deserializeSocketMessage = (string) => JSON.parse(string);
exports.deserializeSocketMessage = deserializeSocketMessage;
const sendSocketMessage = (webSocket, userId, message, content, target, owner) => {
    if (webSocket == undefined) {
        console.log("socket null");
        return;
    }
    const socketMessage = {
        message: message,
        owner: userId.toString(),
    };
    if (content != undefined)
        socketMessage.content = content;
    if (target != undefined)
        socketMessage.target = target;
    if (owner != undefined)
        socketMessage.owner = owner;
    // console.log(serializeSocketMessage(socketMessage));
    webSocket.send((0, exports.serializeSocketMessage)(socketMessage));
};
exports.sendSocketMessage = sendSocketMessage;
