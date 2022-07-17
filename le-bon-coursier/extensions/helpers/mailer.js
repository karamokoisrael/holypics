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
exports.sendMail = exports.sendCustomEmail = void 0;
const fs_1 = __importDefault(require("fs"));
const sendCustomEmail = (mailer, email, subject, data) => {
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
};
exports.sendCustomEmail = sendCustomEmail;
const sendMail = (mailService, email, subject, data, templateName = "default", text = null, lang = "intl") => __awaiter(void 0, void 0, void 0, function* () {
    // const availableLanguages = [ "intl", "en-US"];
    // if(!availableLanguages.includes(lang)) lang =  availableLanguages[1];
    try {
        yield mailService.send({
            to: email,
            subject: subject,
            text: text,
            template: {
                name: `liquid/${lang}/${templateName}`,
                data: data,
            },
        });
        // console.log('mail sent');
        return true;
    }
    catch (error) {
        // console.error(error);
        return false;
    }
});
exports.sendMail = sendMail;
