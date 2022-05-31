export type LeTextoCampainCreate = {
    step: string | null;
    sender: string;
    name: string;
    campaignType: string;
    recipientSource: string;
    groupId: number | null;
    filename: string | null;
    saveAsModel: boolean;
    destination: string;
    message: string;
    emailText: string | null;
    recipients: SmsRecipient[];
    sendAt: any[];
    dlrUrl: string;
    responseUrl: string;
}

export type SmsRecipient = {
    phoneNumber: string;
}


export type LeTextoCampainCreateResponse = {
    "id": string,
    "name": string,
    "createdAt": string,
    "step": number,
    "campaignType": string,
    "recipientSource": string,
    "groupId": number | null,
    "fileName": string | null,
    "saveAsModel": string | null,
    "totalNatSms": number,
    "totalInterSms": number,
    "destination": string,
    "sender": string,
    "message": string,
    "emailText": string | null,
    "sendAt": any[],
    "dlrUrl": string,
    "state": string,
    "sendings": any[],
    "recipientSize": number,
    "responseUrl": string,
    "smsCount": number
}