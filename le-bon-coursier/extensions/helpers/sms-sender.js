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
exports.sendSms = void 0;
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const sendSms = (database, recipients, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [settings] = yield database("configurations");
        recipients = recipients.map((recipient) => { return Object.assign(Object.assign({}, recipient), { phoneNumber: recipient.phoneNumber.replace('+', '').replace(' ', '') }); });
        const payload = {
            "step": null,
            "sender": settings.sms_sender_name,
            "name": `Campagne No${(0, uuid_1.v4)()}`,
            "campaignType": "SIMPLE",
            "recipientSource": "CUSTOM",
            "groupId": null,
            "filename": null,
            "saveAsModel": false,
            "destination": "NAT_INTER",
            "message": message,
            "emailText": null,
            "recipients": recipients,
            "sendAt": [],
            "dlrUrl": "http://dlr.my.domain.com",
            "responseUrl": "http://res.my.domain.com"
        };
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${settings.sms_api_access_token}`,
        };
        const response = yield axios_1.default.post("https://api.letexto.com/v1/campaigns", payload, { headers: headers });
        const campainData = response.data;
        const scheduleResponse = yield axios_1.default.post(`https://api.letexto.com/v1/campaigns/${campainData.id}/schedules`, {}, { headers: headers });
        const scheduleData = scheduleResponse.data;
        if (scheduleData.message != undefined)
            return true;
        return false;
    }
    catch (error) {
        return false;
    }
});
exports.sendSms = sendSms;
