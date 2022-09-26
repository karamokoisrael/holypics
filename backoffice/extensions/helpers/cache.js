"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCacheValue = exports.setCacheValue = exports.getCacheValue = exports.createCache = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const createCache = (stdTTL = 0, checkPeriod = 600) => {
    return new node_cache_1.default({ stdTTL: stdTTL, checkperiod: checkPeriod });
};
exports.createCache = createCache;
const getCacheValue = function (key) {
    const cache = (0, exports.createCache)();
    return cache.get(key);
};
exports.getCacheValue = getCacheValue;
const setCacheValue = (key, value, stdTTL = 0, checkPeriod = 600) => {
    const cache = (0, exports.createCache)(stdTTL, checkPeriod);
    return cache.set(key, value, stdTTL);
};
exports.setCacheValue = setCacheValue;
const deleteCacheValue = (key) => {
    const cache = (0, exports.createCache)();
    return cache.del(key);
};
exports.deleteCacheValue = deleteCacheValue;
