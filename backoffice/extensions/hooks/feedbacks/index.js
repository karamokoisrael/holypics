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
            if (payload.length == 1 && (accountability === null || accountability === void 0 ? void 0 : accountability.user) != null && accountability.user != undefined) {
                try {
                    yield database("feedbacks").update({ seen: 1 }).where({ id: payload[0].id, seen: 0 });
                }
                catch (error) { }
            }
            if (!(accountability === null || accountability === void 0 ? void 0 : accountability.user)) {
                const ids = payload.map((item) => item.id);
                yield database("feedbacks").update({ downloaded_for_dataset: 1 }).whereIn("id", ids);
            }
            return payload;
        }));
    });
}
exports.default = default_1;
;
