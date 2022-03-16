const customExceptions = require("../../helpers/exceptions");
const Joi = require("joi");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcryptjs");
const string = require("../../helpers/string");
const mailer = require("../../helpers/mailer");
const utils = require("../../helpers/utils");
const authHandler = require("../../helpers/auth");

module.exports =  (router, { services, exceptions, getSchema, database, env }) => {
    router.post('/register', async (req, res, next) => {
        try {
            // return customExceptions.throwError(res, "maintenance", 500);

            const validationSchema = Joi.object({

                first_name: Joi.string().label("Veuillez un prénom correcte"),

                last_name: Joi.string().label("Veuillez un nom correcte"),

                city: Joi.number().label("Veuillez sélectionner une ville"),

                email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
                .required()
                .label("Veuillez entrer une adresse email valide"),
    
                password: Joi.string()
                .pattern(new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"))
                .required()
                .label("Veuillez entrer un mot de passe contenant au moins un caractère spécial, une lettre et un chiffre"),
    
                phone: Joi.string()
                // .pattern(new RegExp('^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$'))
                .required()
                .label("Veuillez entrer un numéro de téléphone validate"),
            })
    
            const validationResult = validationSchema.validate(req.body);
    
            if(validationResult.error) return customExceptions.throwError(res, validationResult.error.details[0].context.label, 400);
    
            // const connection = db.getConnection();
            // connection.query(`SELECT * FROM users WHERE email=?`, [req.body.email],  (error, results, fields)=>{
            //     if(error != null) { errorMessage = "unhandled sql error"; return;}
            //     if(results != undefined && results.length > 0) {console.log("working"); resJson.statusCode = 409; resJson.message="email  déjà pris par un autre utilisateur"};
            // })
    
            const memeEmails = await database('users').where('email', '=', req.body.email).count({ total: 'id' });
            if(memeEmails.length > 0 && memeEmails[0].total >0 ) return customExceptions.throwError(res, "email déjà pris par un autre utilisateur", 409); 
            
            const memePhones = await database('users').where('phone', '=', req.body.phone).count({ total: 'id' });
            if(memePhones.length > 0 && memePhones[0].total >0 ) return customExceptions.throwError(res, "numéro de téléphone déjà pris par un autre utilisateur", 409); 
   

            const encryptedPassword = await bcrypt.hash(req.body.password, 10);
 
            await database('users').insert({email: req.body.email.toLowerCase(), phone: req.body.phone, password: encryptedPassword, first_name: req.body.first_name, last_name: req.body.last_name, city: req.body.city,  public_key: uuidv4(), otp: string.random(5, "number")})

            // const directusMailder = new services.MailService(await getSchema())
            // const mailData = { title: "", headerText: "Confirmation d'email", content: "Cliquez sur le bouton ci-dessous pour confirmer votre email", btnText: "Confirmer mon email", btnUrl: process.env.DIRECTUS_URL+"/views/" };
            // mailer.sendCustomEmail(directusMailder, "mstx777@gmail.com", "Confirmation de compte", mailData);

            return customExceptions.successMessage(res, "Inscription réussie. Veuillez vous connecter");
        } catch (error) {
            console.log(error);
            return customExceptions.throwError(res); 
        }
	}); 

    router.post('/login', async (req, res, next) => {
        try {

            const validationSchema = Joi.object({
                username: Joi.string()
                .required()
                .label("Veuillez entrer une adresse email ou un numéro de téléphone correcte"),

                password: Joi.string()
                .required()
                .label("Veuillez entrer un mot de passe"),
            })
    
            const validationResult = validationSchema.validate(req.body);
    
            if(validationResult.error) return customExceptions.throwError(res, validationResult.error.details[0].context.label, 400);
    
    
            const foundUsers = await database('users')
            .where("email", "=", req.body.username)
            .orWhere("phone", "=",req.body.username)
            .select();

            if(foundUsers == 0 || foundUsers.length < 0) return customExceptions.throwError(res, "Mauvais nom d'utilisateur ou mot de passe", 403);
            const user =  foundUsers[0];
            if(! await bcrypt.compare(req.body.password, user.password)){
                return customExceptions.throwError(res, "Mauvais nom d'utilisateur ou mot de passe", 403);
            }

            user.password=null;
            user.public_key = authHandler.getToken({id: user.id, public_key: user.public_key});
            return res.json(user);
        } catch (error) {
            return customExceptions.throwError(res); 
        }
	}); 

    router.get('/getData', async (req, res, next) => {
        try { 
           const decoded = authHandler.decodeToken(req);
           const users = await database('users')
            .where("id", "=", decoded.id)
            .select()
            return res.json(users[0]);
        } catch (error) {
            console.log(error);
            return customExceptions.throwError(res); 
        }
	}); 
};
