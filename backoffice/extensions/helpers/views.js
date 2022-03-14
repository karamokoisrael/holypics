"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
module.exports = {
    renderCustomPage: (res, pageData) => {
        fs.readFile('./extensions/templates/html/custom-page-fr.html', "utf8", function (err, html) {
            Object.keys(pageData).forEach(key => {
                html = html.replace(new RegExp(`{{${key}}}`, "g"), pageData[key]);
            });
            res.send(html);
        });
    }
};
