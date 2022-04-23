export const MAX_LOGIN_ATTEMPTS=6;
export const PASSWORD_ENCRYPTION_SALT=10;
export const ADMIN_ACCESS_TOKEN_CACHE_KEY='adminAccessToken'
export const ADMIN_ID_CACHE_KEY='adminId'
export const USER_TOKEN_EXPIRATION='1440h'
export const DIRECTUS_DEFAULT_LANGUAGE='fr-FR'
export const DEFAULT_ERROR_MESSAGE="Nous avons rencontré une erreur lors de l'opération."
export const ERROR_MESSAGES: Record<string, any> = {
    "OK": {
        message: 'opération effectuée avec succès',
        statusCode: 200
    },
    "INTERNAL_SERVER_ERROR": {
        message: DEFAULT_ERROR_MESSAGE,
        statusCode: 500
    },
    "UNEXPECTED_ERROR": {
        message: DEFAULT_ERROR_MESSAGE,
        statusCode: 500
    },
    "BAD_REQUEST": {
        message: "Mauvaise requête",
        statusCode: 400
    },
    "CONFLICT": {
        message: DEFAULT_ERROR_MESSAGE,
        statusCode: 409
    },
    "INVALID_CREDENTIALS": {
        message: "Identifiants invalides",
        statusCode: 401
    }
}