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
function default_1({ filter }, { database }) {
    return __awaiter(this, void 0, void 0, function* () {
        filter('feedbacks.items.read', (payload, meta, { accountability, schema }) => __awaiter(this, void 0, void 0, function* () {
            if (payload.length == 1) {
                try {
                    yield database("feedbacks").update({ seen: 1 }).where({ id: payload[0].id, seen: 0 });
                    // const { admin_id } = await getAdminTokens(database)
                    // const feedbacksService = new ItemsService("feedbacks", { knex: database as any, schema: schema as SchemaOverview, accountability: { ...accountability, admin: true } as  Accountability });
                    // await feedbacksService.updateOne(payload[0].id, { seen: true })
                }
                catch (error) { }
            }
            return payload;
        }));
    });
}
exports.default = default_1;
;
