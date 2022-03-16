"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.getToken = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const getToken = (identifierData, expiration = "1440h") => {
    const token = jwt.sign(JSON.parse(JSON.stringify(identifierData)), process.env.SECRET, {
        expiresIn: expiration,
    });
    return token;
};
exports.getToken = getToken;
const decodeToken = (req, givenToken = null) => {
    try {
        const token = req == null ? givenToken : req.headers["x-access-token"];
        const decoded = jwt.verify(token, process.env.SECRET);
        if (decoded == null || decoded == undefined || Object.keys(decoded).length == 0)
            return null;
        return decoded;
    }
    catch (e) {
        return null;
    }
};
exports.decodeToken = decodeToken;
