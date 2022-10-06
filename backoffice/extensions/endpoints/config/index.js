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
const directus_1 = require("directus");
const request_handler_1 = require("./../../helpers/request-handler");
const exceptions_1 = require("./../../helpers/exceptions");
const translation_1 = require("../../helpers/translation");
const auth_1 = require("../../helpers/auth");
function default_1(router, { database }) {
    router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { t, lang } = yield (0, translation_1.getTranslator)(req, database);
        try {
            const { admin_id } = yield (0, auth_1.getAdminTokens)(database);
            const { schema, accountability } = (0, request_handler_1.getRequestParams)(req, true);
            const itemsService = new directus_1.ItemsService("models", {
                schema, accountability: Object.assign(Object.assign({}, accountability), { user: admin_id })
            });
            const modelsData = yield itemsService.readByQuery({
                filter: { featured: { _eq: true }, status: { _eq: "published" } },
                // @ts-ignore
                deep: { "translations": { "_filter": { "languages_id": { "_eq": lang } } } }
            });
            const data = {
                models: modelsData === null || modelsData === void 0 ? void 0 : modelsData.map((model) => {
                    const translations = model.translations.find((item) => item.languages_id == lang);
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
