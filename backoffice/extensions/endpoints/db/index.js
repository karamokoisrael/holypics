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
const db_1 = require("../../helpers/db");
const AdmZip = require("adm-zip");
const fs = require('fs');
const multer = require('multer');
function default_1(router, { services, exceptions, getSchema, database, env }) {
    router.get('/getBackupList', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const directus = yield (0, auth_1.getDirectusStatic)(req, req.query.access_token);
            const settings = yield directus.server.info();
            if (settings.os == undefined)
                return res.status(400).json({ message: "You don't have the right to perform this action" });
            const list = yield (0, db_1.getDumpList)();
            return res.json(list);
        }
        catch (error) {
            console.log(error);
            res.status(400).json({ message: "You don't have the right to perform this action" });
        }
    }));
    router.delete('/deleteBackup/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const directus = yield (0, auth_1.getDirectusStatic)(req, req.query.access_token);
            const settings = yield directus.server.info();
            if (settings.os == undefined)
                return res.status(400).json({ message: "You don't have the right to perform this action" });
            const id = req.params["id"];
            (0, db_1.deleteBackup)(id, (...params) => {
                (0, exceptions_1.responseWithId)(res, id);
                // responseWithSingleKey(res, "params", params)
            });
        }
        catch (error) {
            res.status(400).json({ message: "You don't have the right to perform this action" });
        }
    }));
    router.post('/restore/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const directus = yield (0, auth_1.getDirectusStatic)(req, req.query.access_token);
            const settings = yield directus.server.info();
            if (settings.os == undefined)
                return res.status(400).json({ message: "You don't have the right to perform this action" });
            const id = req.params["id"];
            // dump() 
            (0, db_1.restore)(id);
            (0, exceptions_1.responseWithId)(res, id);
        }
        catch (error) {
            console.log(error);
            res.status(400).json({ message: "You don't have the right to perform this action" });
        }
    }));
    router.get('/downloadBackup/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const directus = yield (0, auth_1.getDirectusStatic)(req, req.query.access_token);
            const settings = yield directus.server.info();
            if (settings.os == undefined)
                return res.status(400).json({ message: "You don't have the right to perform this action" });
            const id = req.params["id"];
            const file = `./migration/${id.replace(".sql", "")}.sql`;
            res.download(file);
        }
        catch (error) {
            res.status(400).json({ message: "You don't have the right to perform this action" });
        }
    }));
    router.get('/downloadUploads', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const directus = yield (0, auth_1.getDirectusStatic)(req, req.query.access_token);
            const settings = yield directus.server.info();
            if (settings.os == undefined)
                return res.status(400).json({ message: "You don't have the right to perform this action" });
            const id = req.params["id"];
            const zip = new AdmZip();
            const file = `./migration/uploads_${new Date().toString().replace(/ /g, '_')}.zip`;
            zip.addLocalFolder("./uploads");
            zip.writeZip(file);
            console.log(`Created ${file} successfully`);
            res.download(file);
        }
        catch (error) {
            res.status(400).json({ message: "You don't have the right to perform this action" });
        }
    }));
    router.get('/dump', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const directus = yield (0, auth_1.getDirectusStatic)(req, req.query.access_token);
            const settings = yield directus.server.info();
            if (settings.os == undefined)
                return res.status(400).json({ message: "You don't have the right to perform this action" });
            (0, db_1.dump)();
            res.json({ message: "Opération effectuée avec succès" });
        }
        catch (error) {
            res.status(400).json({ message: "You don't have the right to perform this action" });
        }
    }));
    router.post('/dump', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const directus = yield (0, auth_1.getDirectusStatic)(req, req.query.access_token);
            const settings = yield directus.server.info();
            if (settings.os == undefined)
                return res.status(400).json({ message: "You don't have the right to perform this action" });
            (0, db_1.dump)();
            res.json({ message: "Opération effectuée avec succès" });
        }
        catch (error) {
            res.status(400).json({ message: "You don't have the right to perform this action" });
        }
    }));
    router.get('/downloadSqlite3', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const directus = yield (0, auth_1.getDirectusStatic)(req, req.query.access_token);
            const settings = yield directus.server.info();
            if (settings.os == undefined)
                return res.status(400).json({ message: "You don't have the right to perform this action" });
            const file = `${process.env.DB_FILENAME}`;
            res.download(file);
        }
        catch (error) {
            res.status(400).json({ message: "You don't have the right to perform this action" });
        }
    }));
    router.post('/uploadSqlite3', multer().single('file'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const directus = yield (0, auth_1.getDirectusStatic)(req, req.query.access_token);
            const settings = yield directus.server.info();
            if (settings.os == undefined)
                return res.status(400).json({ message: "You don't have the right to perform this action" });
            fs.unlink(`${process.env.DB_FILENAME}`, () => {
                fs.createWriteStream(process.env.DB_FILENAME).write(req.file.buffer);
            });
            res.json({ message: "Opération effectuée avec succès" });
        }
        catch (error) {
            res.status(400).json({ message: "You don't have the right to perform this action" });
        }
    }));
    router.post('/uploadSql', multer().single('file'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const directus = yield (0, auth_1.getDirectusStatic)(req, req.query.access_token);
            const settings = yield directus.server.info();
            if (settings.os == undefined)
                return res.status(400).json({ message: "You don't have the right to perform this action" });
            yield database.raw(req.file.buffer.toString('utf8'));
            res.json({ message: "Opération effectuée avec succès" });
        }
        catch (error) {
            console.log(error);
            res.status(400).json({ message: "You don't have the right to perform this action" });
        }
    }));
}
exports.default = default_1;
