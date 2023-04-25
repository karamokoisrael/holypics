import { AppSettings } from "./../@types/global";
import { Knex } from "knex";
import {
  LeTextoCampainCreate,
  SmsRecipient,
  LeTextoCampainCreateResponse,
} from "./../@types/leTexto";
import axios from "axios";
import { v4 } from "uuid";

export const sendSms = async (
  database: Knex,
  recipients: Array<SmsRecipient>,
  message: string
) => {
  try {
    const [settings] = await database<AppSettings>("configurations");

    recipients = recipients.map((recipient) => {
      return {
        ...recipient,
        phoneNumber: recipient.phoneNumber.replace("+", "").replace(" ", ""),
      };
    });
    const payload: LeTextoCampainCreate = {
      step: null,
      sender: (settings as any).sms_sender_name as string,
      name: `Campagne No${v4()}`,
      campaignType: "SIMPLE",
      recipientSource: "CUSTOM",
      groupId: null,
      filename: null,
      saveAsModel: false,
      destination: "NAT_INTER",
      message: message,
      emailText: null,
      recipients: recipients,
      sendAt: [],
      dlrUrl: "http://dlr.my.domain.com",
      responseUrl: "http://res.my.domain.com",
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${(settings as any).sms_api_access_token}`,
    };

    const response = await axios.post(
      "https://api.letexto.com/v1/campaigns",
      payload,
      { headers: headers }
    );
    const campainData = response.data as LeTextoCampainCreateResponse;

    const scheduleResponse = await axios.post(
      `https://api.letexto.com/v1/campaigns/${campainData.id}/schedules`,
      {},
      { headers: headers }
    );
    const scheduleData = scheduleResponse.data as Record<string, any>;
    if (scheduleData.message != undefined) return true;
    return false;
  } catch (error) {
    return false;
  }
};
