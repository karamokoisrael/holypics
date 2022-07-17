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
const exceptions_1 = require("../../helpers/exceptions");
const request_handler_1 = require("../../helpers/request-handler");
const utils_1 = require("../../helpers/utils");
exports.default = (router, { services, exceptions, getSchema, database, env }) => {
    router.get('/translations', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { access_token } = yield (0, auth_1.getAdminTokens)(database);
            const directus = yield (0, auth_1.getDirectusStatic)(req, access_token);
            const { filters } = (0, request_handler_1.getRequestParams)(req);
            const settings = directus.settings.read({ filter: Object.assign({}, filters) });
            res.json(settings);
        }
        catch (error) {
            return (0, exceptions_1.throwError)(res);
        }
    }));
    router.get('/file/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.redirect(`${(0, utils_1.getHost)(req)}/file/${req.params.id}`);
        }
        catch (error) {
            console.log(error);
            return (0, exceptions_1.throwError)(res);
        }
    }));
};
