const customExceptions = require("../../helpers/exceptions");
const viewHandler = require("../../helpers/views");
const utils = require("../../helpers/utils");
const express = require('express');
const directus = require("directus");

module.exports = (router, { services, exceptions, getSchema, database, env }) => {
    router.get('/test', async (req, res, next) => {  
        const htmlBody = /*html*/ `
            <form action=${"sfds"}>
                <p>Nouveau mot de passe</p>
                <input type="password" placeholder="Nouveau mot de passe" value=""/><br/>

                <p>Confirmation du mot de passe</p>
                <input type="password" placeholder="Confirmation du mot de passe" value=""/><br/><br/>
                
                <button type="submit" class="btn btn-primary">Changer mon mot de passe</button>
            </form>
        `;

        viewHandler.renderCustomPage(res, { title: "Mon Immo", headerText: "Mise à jour du mot de passe", content: htmlBody, btnText: "Retourner à l'accueil", logoUrl: "https://www.npm.js.com/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci85ZDIzYmQyZTMwZGU3ZDJkODgzM2ZjOTc0NTUwNjg4Yj9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.3AMW13onSM__1QZAKEqN5amByirHWyydo5D3z0u2Ro4" });
	}); 

    
    
    router.get('/ejs', async (req, res, next) => {
        // const results = await database('users').where('id', '!=', 0)
        const app = await directus.createApp();
        app.set('view engine', 'ejs');
        // console.log(app);
        // // console.log(results);

        res.render('./extensions/templates/ejs/pages/index', {
          subject: 'EJS template engine',
          name: 'our template',
          link: 'https://google.com'
        });

        // res.json({})
      });
};