import fs from "fs";

export const sendCustomEmail = (mailer: any, email: string, subject: string, data: Record<string, any>)=>{
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

export const sendMail = async (mailService: any, email: string, subject: string, data: Record<string, any>, templateName="default", text=null, lang = "intl")=>{
    // const availableLanguages = [ "intl", "en-US"];
    // if(!availableLanguages.includes(lang)) lang =  availableLanguages[1];
    try {
        
        await mailService.send({
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
    } catch (error) {
        // console.error(error);
        return false;
    }
}