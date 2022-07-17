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
exports.getConfigs = void 0;
const getConfigs = (database, model) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [modelData] = yield database("models").where({ name: model }).limit(1);
        modelData.parameters = JSON.parse(`${modelData.parameters}`);
        return modelData;
    }
    catch (error) {
        return {};
    }
});
exports.getConfigs = getConfigs;
