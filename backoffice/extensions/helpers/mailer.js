"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
module.exports = {
    sendCustomEmail: (mailer, email, subject, data) => {
        fs_1.default.readFile('./extensions/templates/html/custom-email-fr.html', "utf8", function (err, html) {
            Object.keys(data).forEach(key => {
                html = html.replace(new RegExp(`{{${key}}}`, "g"), data[key]);
            });
            mailer.send({
                from: process.env.EMAIL_FROM,
                to: email,
                html: html,
                subject: subject,
            });
        });
    }
};
