import { sendSms } from './sms-sender';
import { Directus, TypeMap } from '@directus/sdk';
import { Notification } from '@directus/shared/types';
import { MailService } from 'directus';
import { Knex } from "knex";
import { NotificationPayload } from "../@types/directus";
import User from '../@types/user';
import { sendMail } from './mailer';

export const notify = async (database: Knex, mailService: MailService | null = null, subject: string, message: string, userId:string, collection: string | null = null, item: string | null =null, emailActivated =false, smsActivated=false, data: Record<string, any>={}, smsText=null, emailTemplate="default", lang="intl")=>{
    try {
        const [ user ]: User[] = await database("directus_users").where({id: userId}).limit(1)

        const payload: NotificationPayload = {
            status: "inbox",
            timestamp: new Date().toISOString(),
            recipient: userId,
            sender: userId,
            subject: subject,
            message: message,
            collection: collection,
            item: item
        }

        await database("directus_notifications").insert({...payload})
        
        if(emailActivated && mailService != null) {
            const mailData = Object.keys(data).length > 0 ? data :  { headerText: subject, content: message, btnText: "", btnUrl: ""};
            await sendMail(mailService, user.email, subject, mailData, emailTemplate, null, lang)
        }
        
        if(smsActivated &&  user.phone_number!=null &&  user.phone_number!=undefined){
            await sendSms(database, [{ phoneNumber: user.phone_number.replace("+", "") }],smsText == null ? message : smsText)
        }
        // return notification;
    } catch (error) {
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
        }
    }
}

