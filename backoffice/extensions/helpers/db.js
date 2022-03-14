"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = exports.restore = exports.dump = void 0;
const mysql_1 = __importDefault(require("mysql"));
const mysqldump_1 = __importDefault(require("mysqldump"));
// import { Importer } from "mysql-import";
const Importer = require('mysql-import');
const dump = () => {
    (0, mysqldump_1.default)({
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        },
        dumpToFile: `./extensions/backup/${new Date()}.sql`,
    });
};
exports.dump = dump;
const restore = () => {
    const importer = new Importer({ host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE });
    // New onProgress method, added in version 5.0!
    importer.onProgress((progress) => {
        var percent = Math.floor(progress.bytes_processed / progress.total_bytes * 10000) / 100;
        console.log(`${percent}% Completed`);
    });
    importer.import('./dump.sql').then(() => {
        var files_imported = importer.getImported();
        console.log(`${files_imported.length} SQL file(s) imported.`);
    }).catch((e) => {
        console.error(e);
    });
};
exports.restore = restore;
const getConnection = () => {
    const connection = mysql_1.default.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });
    return connection;
};
exports.getConnection = getConnection;
