"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCustomPage = void 0;
const fs = require("fs");
const renderCustomPage = (res, pageData) => {
    fs.readFile('./extensions/templates/html/custom-page-fr.html', "utf8", function (err, html) {
        Object.keys(pageData).forEach(key => {
            html = html.replace(new RegExp(`{{${key}}}`, "g"), pageData[key]);
        });
        res.send(html);
    });
};
exports.renderCustomPage = renderCustomPage;
