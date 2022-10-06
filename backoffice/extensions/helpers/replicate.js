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
exports.ReplicateModel = void 0;
const axios_1 = __importDefault(require("axios"));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
class Replicate {
    constructor({ apiToken, pollingInterval } = { apiToken: "", pollingInterval: 5000 }) {
        this.apiToken = apiToken;
        this.pollingInterval = pollingInterval;
    }
    startPrediction(modelId, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = { Authorization: `Token ${this.apiToken}` };
            return yield axios_1.default.post("https://api.replicate.com/v1/predictions", { version: modelId, input }, { headers });
        });
    }
    getPrediction(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = { Authorization: `Token ${this.apiToken}` };
            return yield axios_1.default.get(`https://api.replicate.com/v1/predictions/${id}`, { headers });
        });
    }
    predict(modelId, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const startResponse = yield this.startPrediction(modelId, input);
            let predictionStatus;
            do {
                console.log("checking");
                const checkResponse = yield this.getPrediction(startResponse.data.id);
                predictionStatus = checkResponse.data.status;
                console.log("status => ", predictionStatus);
                yield sleep(this.pollingInterval);
                return checkResponse.data;
            } while (["starting", "processing"].includes(predictionStatus));
        });
    }
}
exports.default = Replicate;
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
}
exports.ReplicateModel = ReplicateModel;
