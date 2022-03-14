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
const db_1 = require("../../helpers/db");
const exceptions_1 = require("../../helpers/exceptions");
function default_1(router) {
    router.get('/delete-backup/:id', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        console.log(req.params["id"]);
        (0, exceptions_1.successMessage)(res);
    }));
    router.get('/get-backup-list', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        (0, db_1.getDumpList)((list) => {
            return res.json(list);
        });
        return [];
    }));
    router.get('/db-restore', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        (0, db_1.restore)();
        (0, exceptions_1.successMessage)(res);
    }));
}
exports.default = default_1;
