"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = exports.TRANSLATIONS_CACHE_KEY = exports.DEFAULT_ERROR_MESSAGE = exports.DIRECTUS_DEFAULT_LANGUAGE = exports.USER_TOKEN_EXPIRATION = exports.ADMIN_ID_CACHE_KEY = exports.ADMIN_ACCESS_TOKEN_CACHE_KEY = exports.PASSWORD_ENCRYPTION_SALT = exports.MAX_LOGIN_ATTEMPTS = void 0;
exports.MAX_LOGIN_ATTEMPTS = 6;
exports.PASSWORD_ENCRYPTION_SALT = 10;
exports.ADMIN_ACCESS_TOKEN_CACHE_KEY = 'adminAccessToken';
exports.ADMIN_ID_CACHE_KEY = 'adminId';
exports.USER_TOKEN_EXPIRATION = '1440h';
exports.DIRECTUS_DEFAULT_LANGUAGE = 'fr-FR';
exports.DEFAULT_ERROR_MESSAGE = "Nous avons rencontré une erreur lors de l'opération.";
exports.TRANSLATIONS_CACHE_KEY = "translation_strings";
exports.ERROR_MESSAGES = {
    "OK": {
        message: 'opération effectuée avec succès',
        statusCode: 200
    },
    "INTERNAL_SERVER_ERROR": {
        message: exports.DEFAULT_ERROR_MESSAGE,
        statusCode: 500
    },
    "UNEXPECTED_ERROR": {
        message: exports.DEFAULT_ERROR_MESSAGE,
        statusCode: 500
    },
    "BAD_REQUEST": {
        message: "Mauvaise requête",
        statusCode: 400
    },
    "CONFLICT": {
        message: exports.DEFAULT_ERROR_MESSAGE,
        statusCode: 409
    },
    "INVALID_CREDENTIALS": {
        message: "Identifiants invalides",
        statusCode: 401
    }
};
