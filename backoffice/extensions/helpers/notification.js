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
Object.defineProperty(exports, "__esModule", { value: true });
exports.notify = void 0;
const sms_sender_1 = require("./sms-sender");
const mailer_1 = require("./mailer");
const notify = (database, mailService = null, subject, message, userId, collection = null, item = null, emailActivated = false, smsActivated = false, data = {}, smsText = null, emailTemplate = "default", lang = "intl") => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [user] = yield database("directus_users").where({ id: userId }).limit(1);
        const payload = {
            status: "inbox",
            timestamp: new Date().toISOString(),
            recipient: userId,
            sender: userId,
            subject: subject,
            message: message,
            collection: collection,
            item: item
        };
        yield database("directus_notifications").insert(Object.assign({}, payload));
        if (emailActivated && mailService != null) {
            const mailData = Object.keys(data).length > 0 ? data : { headerText: subject, content: message, btnText: "", btnUrl: "" };
            yield (0, mailer_1.sendMail)(mailService, user.email, subject, mailData, emailTemplate, null, lang);
        }
        if (smsActivated && user.phone_number != null && user.phone_number != undefined) {
            yield (0, sms_sender_1.sendSms)(database, [{ phoneNumber: user.phone_number.replace("+", "") }], smsText == null ? message : smsText);
        }
        // return notification;
    }
    catch (error) {
        return {
            id: "",
            status: "",
            timestamp: "",
            recipient: "",
            sender: null,
            subject: null,
            message: null,
            collection: null,
            item: null,
        };
    }
});
exports.notify = notify;
