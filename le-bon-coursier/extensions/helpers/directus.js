"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectToEqFilter = void 0;
const ObjectToEqFilter = (object) => {
    const filter = {};
    Object.keys(object).forEach(key => {
        filter[key] = { "_eq": object[key] };
    });
    return filter;
};
exports.ObjectToEqFilter = ObjectToEqFilter;
