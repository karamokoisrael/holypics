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
const cron = require('node-cron');
cron.schedule('* * * * *', () => {
    console.log('running a task every minute');
});
function default_1(router) {
    router.get('/db-backup', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        (0, db_1.dump)();
        return res.json({ message: "done" });
    }));
    router.get('/get-backup-list', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        (0, db_1.getDumpList)((list) => {
            return res.json(list);
        });
        return [];
    }));
    router.get('/db-restore', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        (0, db_1.restore)();
        return res.json({ message: "done" });
    }));
}
exports.default = default_1;
