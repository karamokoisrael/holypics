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
const exceptions_1 = require("../../helpers/exceptions");
exports.default = (router, { database }) => {
    router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // const { access_token } = await getAdminTokens(database);
            // res.redirect(getHost(req)+`/assets/${req.params.id}?access_token=${access_token}`);
            const [file] = yield database("directus_files").where({ id: req.params.id });
            res.sendFile(`${__dirname.replace("extensions/endpoints/file", "")}/uploads/${file.filename_disk}`);
        }
        catch (error) {
            console.log(error);
            return (0, exceptions_1.throwError)(res);
        }
    }));
    router.get('/tmp/download', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.sendFile(`${__dirname.replace("extensions/endpoints/file", "")}/uploads/tmp/${req.query.path}`);
        }
        catch (error) {
            console.log(error);
            return (0, exceptions_1.throwError)(res);
        }
    }));
};
