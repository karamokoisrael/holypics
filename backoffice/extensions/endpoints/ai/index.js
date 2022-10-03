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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const request_handler_1 = require("../../helpers/request-handler");
const express_1 = __importDefault(require("express"));
// const multer = require('multer');
function default_1(router, { database }) {
    const accessForbiddenPath = "?access_token=XXXXXX";
    function selectProxyHost(req) {
        const noAuthAccess = true;
        const { accountability } = (0, request_handler_1.getRequestParams)(req);
        return (accountability === null || accountability === void 0 ? void 0 : accountability.user) || noAuthAccess ? "https://mgx-tf-serving.karamokoisrael.tech" : accessForbiddenPath;
    }
    // @ts-ignore
    router.use(express_1.default.json({ limit: "10mb", extended: true }));
    router.use(express_1.default.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));
    router.use('/', (0, express_http_proxy_1.default)(selectProxyHost, {
        limit: '100mb',
        proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
            // you can update headers
            proxyReqOpts.headers['Content-Type'] = 'application/json';
            // you can change the method
            // proxyReqOpts.method = 'GET';
            return proxyReqOpts;
        },
        proxyReqBodyDecorator: function (bodyContent, srcReq) {
            if (bodyContent.instance)
                bodyContent.instances = [bodyContent.instance];
            return bodyContent;
        },
        proxyReqPathResolver: function (req) {
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const { accountability } = (0, request_handler_1.getRequestParams)(req);
                        if (accountability === null || accountability === void 0 ? void 0 : accountability.user) {
                            const [{ subscription_deadline }] = yield database("directus_users").select("subscription_deadline").where("id", accountability === null || accountability === void 0 ? void 0 : accountability.user);
                            resolve(subscription_deadline != null ? req.url.split("?")[0] : accessForbiddenPath);
                        }
                        else {
                            resolve(req.url);
                        }
                    }
                    catch (error) {
                        console.log(error);
                        reject(error);
                    }
                });
            });
        }
    }));
}
exports.default = default_1;
