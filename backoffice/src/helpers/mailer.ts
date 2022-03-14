import fs from "fs";
import { CustomObject } from "../models/object";

export const sendCustomEmail = (mailer: any, email: string, subject: string, data: CustomObject)=>{
        fs.readFile('./extensions/templates/html/custom-email-fr.html',"utf8", function(err, html) {
            Object.keys(data).forEach(key => {
                html = html.replace(new RegExp(`{{${key}}}`,"g"), data[key]); 
            });
            mailer.send({
                from: process.env.EMAIL_FROM,
                to: email,
                html: html,
                subject: subject,
            })                 
    });
}