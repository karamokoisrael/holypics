"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.updateAlertLevel = exports.increaseAlertLevel = exports.reinitAlertLevel = exports.checkoutAlertLevel = exports.generateVerificationCode = exports.getUserAccessToken = exports.decodeToken = exports.getToken = exports.secureUserData = exports.getDirectus = exports.getDirectusStatic = exports.getAdminTokens = void 0;
const global_1 = require("./../consts/global");
const utils_1 = require("./utils");
const jwt = __importStar(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const global_2 = require("../consts/global");
const cache_1 = require("./cache");
const sdk_1 = require("@directus/sdk");
const getAdminTokens = (database) => __awaiter(void 0, void 0, void 0, function* () {
    let accessToken = "";
    let adminId = "";
    try {
        const cachedToken = (0, cache_1.getCacheValue)(global_1.ADMIN_ACCESS_TOKEN_CACHE_KEY);
        const cachedId = (0, cache_1.getCacheValue)(global_1.ADMIN_ID_CACHE_KEY);
        if (cachedToken != null && cachedToken != undefined && cachedId != null && cachedId != undefined) {
            accessToken = cachedToken;
            adminId = cachedId;
        }
        else {
            const [[{ token, id }]] = yield database.raw("SELECT directus_users.token, directus_users.id from directus_roles RIGHT JOIN directus_users ON directus_users.role = directus_roles.id AND directus_users.token IS NOT NULL WHERE directus_roles.admin_access=1 LIMIT 1");
            adminId = id;
            (0, cache_1.setCacheValue)(global_1.ADMIN_ACCESS_TOKEN_CACHE_KEY, token);
            accessToken = token;
        }
        return { access_token: accessToken, admin_id: adminId };
    }
    catch (error) {
        return { access_token: "", admin_id: undefined };
    }
});
exports.getAdminTokens = getAdminTokens;
const getDirectusStatic = (req, accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const directus = new sdk_1.Directus((0, utils_1.getHost)(req));
    const authResult = yield directus.auth.static(accessToken);
    // console.log(authResult);
    return directus;
});
exports.getDirectusStatic = getDirectusStatic;
const getDirectus = (req, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const directus = new sdk_1.Directus((0, utils_1.getHost)(req));
    const authResult = yield directus.auth.login({ email, password });
    return { directus, authResult };
});
exports.getDirectus = getDirectus;
const secureUserData = (user, req = null, additionalProps = {}, currentAccessToken = null) => {
    const nullables = { password: null, token: null, otp: null, verification_code: null };
    try {
        const accessToken = req == null ? currentAccessToken : (0, exports.getUserAccessToken)(req);
        return { data: Object.assign(Object.assign(Object.assign(Object.assign({}, user), nullables), { token: accessToken }), additionalProps) };
    }
    catch (error) {
        console.log(error);
        return { data: Object.assign(Object.assign(Object.assign({}, user), nullables), additionalProps) };
    }
};
exports.secureUserData = secureUserData;
const getToken = (identifierData, expiration = global_1.USER_TOKEN_EXPIRATION) => {
    const token = jwt.sign(JSON.parse(JSON.stringify(identifierData)), process.env.SECRET, {
        expiresIn: expiration,
    });
    return token;
};
exports.getToken = getToken;
const decodeToken = (req = null, givenToken = null) => {
    try {
        const token = req == null ? givenToken : (0, exports.getUserAccessToken)(req);
        const decoded = jwt.verify(token, process.env.SECRET, { issuer: 'directus' });
        return { decoded, token };
    }
    catch (error) {
        return { decoded: null, token: null };
    }
};
exports.decodeToken = decodeToken;
const getUserAccessToken = (req) => {
    const authorization = req.headers["authorization"];
    if (authorization.startsWith("Bearer ")) {
        return authorization.substring(7, authorization.length);
    }
    else {
        return null;
    }
};
exports.getUserAccessToken = getUserAccessToken;
const generateVerificationCode = (database, userId = null, email = null, currentAlertLevel = -1, toggleAlertLevel = false) => __awaiter(void 0, void 0, void 0, function* () {
    const idField = userId == null ? 'email' : 'id';
    const idValue = userId == null ? email : userId;
    const verificationCode = (0, uuid_1.v4)();
    // if(toggleAlertLevel){
    //     increaseAlertLevel(database, userId, email, currentAlertLevel);
    // }
    yield database('directus_users').update({ verification_code: verificationCode }).where(idField, '=', idValue);
    return verificationCode;
});
exports.generateVerificationCode = generateVerificationCode;
const checkoutAlertLevel = (alertLevel, reinit = false) => {
    let accountLocked = 0;
    if (alertLevel >= global_2.MAX_LOGIN_ATTEMPTS) {
        alertLevel = 0;
        accountLocked = 1;
    }
    else {
        if (alertLevel == 0 && !reinit) {
            accountLocked = 0;
        }
    }
    return [alertLevel, accountLocked];
};
exports.checkoutAlertLevel = checkoutAlertLevel;
const reinitAlertLevel = (database, userId = null, email = null) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.updateAlertLevel)(database, 0, userId, email, true);
});
exports.reinitAlertLevel = reinitAlertLevel;
const increaseAlertLevel = (database, userId = null, email = null, currentAlertLevel = -2) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.updateAlertLevel)(database, currentAlertLevel + 1, userId, email);
});
exports.increaseAlertLevel = increaseAlertLevel;
const updateAlertLevel = (database, alertLevel = -1, userId = null, email = null, reinit = false) => __awaiter(void 0, void 0, void 0, function* () {
    const idField = userId == null ? 'email' : 'id';
    const idValue = userId == null ? email : userId;
    let accountLocked = 0;
    if (alertLevel == -1) {
        const [user] = yield database('directus_users');
        alertLevel = user.alert_level;
    }
    [alertLevel, accountLocked] = (0, exports.checkoutAlertLevel)(alertLevel, reinit);
    yield database('directus_users').update({ alert_level: alertLevel, account_locked: accountLocked }).where(idField, '=', idValue);
});
exports.updateAlertLevel = updateAlertLevel;
