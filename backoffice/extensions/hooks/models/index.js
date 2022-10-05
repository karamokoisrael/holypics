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
const fs = require('fs');
const bodyParser = require('body-parser');
function default_1({ filter }, { database, getSchema }) {
    return __awaiter(this, void 0, void 0, function* () {
        // const modelTranslationsService = new ItemsService("models_translations", { knex: database as any, schema: await getSchema(), accountability: { admin: true, app: true, role: "", } });
        // filter('models.items.read', async (payload: any) => {
        //     for (let i = 0; i < payload.length; i++) {
        //         const translation = await modelTranslationsService.readByQuery({ filter: { models_id: { _eq: payload[i].id } } })
        //         payload[i].translations = translation;
        //     }
        // })
    });
}
exports.default = default_1;
;
