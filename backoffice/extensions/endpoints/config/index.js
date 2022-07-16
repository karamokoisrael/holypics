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
function default_1(router, { database }) {
    router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { access_token } = yield (0, auth_2.getAdminTokens)(database);
            const directus = yield (0, auth_1.getDirectusStatic)(req, access_token);
            const modelsData = yield directus.items("models").readByQuery();
            const data = { models: modelsData.data };
            // const configs = await getConfigs(database, "holypics");
            return res.json({ data });
        }
        catch (error) {
            console.log(error);
            return (0, exceptions_1.throwError)(res);
        }
    }));
}
exports.default = default_1;
