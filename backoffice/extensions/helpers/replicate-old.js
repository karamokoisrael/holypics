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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultFetchHTTPClient = exports.ReplicateModel = exports.Replicate = void 0;
const fetch = require("node-fetch");
// Default configuration
const BASE_URL = "https://api.replicate.com/v1";
const DEFAULT_POLLING_INTERVAL = 5000;
// Utility functions
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;
class Replicate {
    constructor({ token, proxyUrl, httpClient, pollingInterval } = {}) {
        var _a;
        this.token = token;
        this.baseUrl = proxyUrl ? `${proxyUrl}/${BASE_URL}` : BASE_URL;
        this.httpClient = httpClient;
        this.pollingInterval = pollingInterval;
        // Uses some lesser-known operators to make null-safety easy
        this.pollingInterval || (this.pollingInterval = DEFAULT_POLLING_INTERVAL);
        // @ts-ignore
        this.token || (this.token = isNode ? (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.REPLICATE_API_TOKEN : null);
        if (!this.token && !proxyUrl)
            throw new Error("Missing Replicate token");
        // @ts-ignore
        if (!this.httpClient)
            this.httpClient = new DefaultFetchHTTPClient(this.token);
        this.models = {
            // @ts-ignore
            get: (path, version = null) => ReplicateModel.fetch({ path, version, replicate: this }),
        };
    }
    getModel(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callHttpClient({
                url: `/models/${path}/versions`,
                method: "get",
                event: "getModel",
            });
        });
    }
    getPrediction(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callHttpClient({
                url: `/predictions/${id}`,
                method: "get",
                event: "getPrediction",
            });
        });
    }
    // @ts-ignore
    startPrediction(modelVersion, input, webhookCompleted = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callHttpClient({
                url: "/predictions",
                method: "post",
                event: "startPrediction",
                body: { version: modelVersion, input: input, webhook_completed: webhookCompleted },
            });
        });
    }
    // @ts-ignore
    callHttpClient({ url, method, event, body }) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            return yield this.httpClient[method]({
                url: `${this.baseUrl}${url}`,
                method,
                event,
                body,
                // @ts-ignore
                token: this.token,
            });
        });
    }
}
exports.Replicate = Replicate;
class ReplicateModel {
    static fetch(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = new ReplicateModel(options);
            yield model.getModelDetails();
            return model;
        });
    }
    constructor({ path, version, replicate }) {
        this.path = path;
        this.version = version;
        this.replicate = replicate;
    }
    getModelDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.replicate.getModel(this.path);
            const modelVersions = response.results;
            const mostRecentVersion = modelVersions[0];
            const explicitlySelectedVersion = modelVersions.find((m) => m.id == this.version);
            this.modelDetails = explicitlySelectedVersion ? explicitlySelectedVersion : mostRecentVersion;
            if (this.version && this.version !== this.modelDetails.id) {
                console.warn(`Model (version:${this.version}) not found, defaulting to ${mostRecentVersion.id}`);
            }
        });
    }
    predictor(input) {
        return __asyncGenerator(this, arguments, function* predictor_1() {
            const startResponse = yield __await(this.replicate.startPrediction(this.modelDetails.id, input));
            let predictionStatus;
            do {
                const checkResponse = yield __await(this.replicate.getPrediction(startResponse.id));
                predictionStatus = checkResponse.status;
                yield __await(sleep(this.replicate.pollingInterval));
                yield yield __await(checkResponse.output);
            } while (["starting", "processing"].includes(predictionStatus));
        });
    }
    predict(input = "") {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            let prediction;
            try {
                for (var _b = __asyncValues(this.predictor(input)), _c; _c = yield _b.next(), !_c.done;) {
                    prediction = _c.value;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return prediction;
        });
    }
}
exports.ReplicateModel = ReplicateModel;
// This class just makes it a bit easier to call fetch -- interface similar to the axios library
class DefaultFetchHTTPClient {
    constructor(token) {
        this.headers = {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        };
    }
    get({ url }) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url, { headers: this.headers });
            return yield response.json();
        });
    }
    post({ url, body }) {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchOptions = {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(body),
            };
            const response = yield fetch(url, fetchOptions);
            return yield response.json();
        });
    }
}
exports.DefaultFetchHTTPClient = DefaultFetchHTTPClient;
exports.default = Replicate;
