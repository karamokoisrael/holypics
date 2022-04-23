import { sendSms } from './sms-sender';
import { Directus, TypeMap } from '@directus/sdk';
import { Notification } from '@directus/shared/types';
import { MailService } from 'directus';
import { Knex } from "knex"
import moment from 'moment';
import { NotificationPayload } from "../@types/directus";
import User from '../@types/user';
import { sendMail } from './mailer';

export const notify = async (database: Knex, mailService: MailService | null = null, subject: string, message: string, userId:string, collection: string | null = null, item: string | null =null, emailActivated =false, smsActivated=false, data: Record<string, any>={}, smsText=null, emailTemplate="default", lang="intl")=>{
    try {
        const [ user ]: User[] = await database("directus_users").where({id: userId}).limit(1)

        const storePayload = {
            status: "published",
            date_created: moment().format('YYYY-MM-DD HH:mm:ss'),
            user_created: userId,
            subject: subject,
            message: message,
        }

        const [ notificationId ]: number[] = await database("notifications").insert(storePayload)

        const payload: NotificationPayload = {
            status: "inbox",
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
            recipient: userId,
            sender: userId,
            subject: subject,
            message: message,
            collection: collection ==  null ? "notifications" : collection,
            item: item == null ? notificationId : item
        }

        const notification = await database("directus_notifications").insert({...payload})
        
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

