const customExceptions = require("../../helpers/exceptions");
const viewHandler = require("../../helpers/views");
const utils = require("../../helpers/utils");
const express = require('express');
const directus = require("directus");
const mailer = require("../../helpers/mailer");

module.exports = (router, { services, exceptions, getSchema, database, env }) => {
    router.get('/random', async (req, res, next) => {  
        const directusMailder = new services.MailService(await getSchema())
        const mailData = { title: "", headerText: "Confirmation d'email", content: "Cliquez sur le bouton ci-dessous pour confirmer votre email", btnText: "Confirmer mon email", btnUrl: process.env.DIRECTUS_URL+"/views/" };
        mailer.sendCustomEmail(directusMailder, "mstx777@gmail.com", "Confirmation de compte", mailData);
        res.json({})
    }); 

};