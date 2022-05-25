"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonResponse = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class JsonResponse extends exceptions_1.BaseException {
    constructor(id, data) {
        super("", 200, "");
        this.id = id;
        this.data = data;
    }
}
exports.JsonResponse = JsonResponse;
