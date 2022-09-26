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
const auth_1 = require("./../../helpers/auth");
const exceptions_1 = require("./../../helpers/exceptions");
const auth_2 = require("../../helpers/auth");
const translation_1 = require("../../helpers/translation");
function default_1(router, { database }) {
    router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { t, lang } = yield (0, translation_1.getTranslator)(req, database);
        try {
            const { access_token } = yield (0, auth_2.getAdminTokens)(database);
            const directus = yield (0, auth_1.getDirectusStatic)(req, access_token);
            const modelsData = yield directus.items("models").readByQuery();
            const data = {
                models: (_a = modelsData.data) === null || _a === void 0 ? void 0 : _a.map((model) => {
                    const translations = model.translations.find((item) => item.languages_id == lang);
                    model.translations = undefined;
                    return Object.assign(Object.assign({}, (translations != null && translations != undefined ? translations : {})), model);
                })
            };
            return res.json({ data });
        }
        catch (error) {
            console.log(error);
            return (0, exceptions_1.throwError)(res, t("we_encountered_an_unexpected_error_during_the_operation"));
        }
    }));
}
exports.default = default_1;
