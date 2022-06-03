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
const getConfigs = (database) => __awaiter(void 0, void 0, void 0, function* () {
    const [configurations] = yield database("configurations").limit(1);
    const datasets = yield database("datasets").where({ status: "published" });
    configurations.datasets = datasets;
    for (let i = 0; i < datasets.length; i++) {
        const production_models = yield database("datasets_models").where({
            datasets_id: datasets[i].id
        });
        for (let u = 0; u < production_models.length; u++) {
            const [model] = yield database("models").where({ id: production_models[u].models_id }).limit(1);
            if (model.config != null)
                model.config = JSON.parse(model.config);
            production_models[u].model = model;
        }
        if (datasets[i].class_names != null)
            datasets[i].class_names = JSON.parse(datasets[i].class_names);
        datasets[i].production_models = production_models;
    }
    return configurations;
});
exports.getConfigs = getConfigs;
