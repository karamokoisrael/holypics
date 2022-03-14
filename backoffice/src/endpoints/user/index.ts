import { Router, Request, Response, NextFunction } from "express";
import { JsonObject } from "../../@types/global";
import { sendMail } from "../../helpers/mailer"
const customExceptions = require("../../helpers/exceptions");
import * as Joi from "joi";
import { v4 } from "uuid";
import { hash, compare } from "bcryptjs";
import { random } from "../../helpers/string";
import * as authHandler from "../../helpers/auth";

module.exports =  (router: Router, { services, exceptions, getSchema, database, env }: Record<string, any>) => {
    router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
        try {

            const validationSchema = Joi.object({

                first_name: Joi.string().label("Veuillez un prénom correcte").required(),

                last_name: Joi.string().label("Veuillez un nom correcte").required(),

                city: Joi.number().label("Veuillez sélectionner une ville").required(),

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
    
            //@ts-ignore
            if(validationResult.error) return customExceptions.throwError(res, validationResult.error.details[0].context.label, 400);
    
            const memeEmails = await database('users').where('email', '=', req.body.email).count({ total: 'id' });
            if(memeEmails.length > 0 && memeEmails[0].total >0 ) return customExceptions.throwError(res, "email déjà pris par un autre utilisateur", 409); 
            
            const memePhones = await database('users').where('phone', '=', req.body.phone).count({ total: 'id' });
            if(memePhones.length > 0 && memePhones[0].total >0 ) return customExceptions.throwError(res, "numéro de téléphone déjà pris par un autre utilisateur", 409); 
   

            const encryptedPassword = await hash(req.body.password, 10);
            const otp = random(5, "number");
            await database('users').insert({email: req.body.email.toLowerCase(), phone: req.body.phone, password: encryptedPassword, first_name: req.body.first_name, last_name: req.body.last_name, city: req.body.city,  public_key: v4(), otp: otp})

            const mailService = new services.MailService(await getSchema())
            const mailData = { title: "", headerText: "Confirmation d'email", content: "Cliquez sur le bouton ci-dessous pour confirmer votre email", btnText: "Confirmer mon email", btnUrl: process.env.DIRECTUS_URL+`/views/confirm-email?email=${req.body.email}&otp=${otp}` };
           
            await sendMail(mailService, req.body.email, "Confirmation d'email", mailData)
            
            return customExceptions.successMessage(res, "Inscription réussie. Veuillez vous connecter");
            
        } catch (error) {
            console.log(error);
            return customExceptions.throwError(res); 
        }
	}); 

    router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
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
            
            //@ts-ignore
            if(validationResult.error) return customExceptions.throwError(res, validationResult.error.details[0].context.label, 400);
    
    
            const foundUsers = await database('users')
            .where("email", "=", req.body.username)
            .orWhere("phone", "=",req.body.username)
            .select();

            if(foundUsers == 0 || foundUsers.length < 0) return customExceptions.throwError(res, "Mauvais nom d'utilisateur ou mot de passe", 403);
            const user =  foundUsers[0];
            if(! await compare(req.body.password, user.password) ){
                return customExceptions.throwError(res, "Mauvais nom d'utilisateur ou mot de passe", 403);
            }

            user.password=null;
            user.public_key = authHandler.getToken({id: user.id, public_key: user.public_key});
            return res.json(user);
        } catch (error) {
            return customExceptions.throwError(res); 
        }
	}); 

    router.get('/getData', async (req: Request, res: Response, next: NextFunction) => {
        try { 
           const decoded:any = authHandler.decodeToken(req);
           const users = await database('users')
            .where("id", "=", decoded.id)
            .select()
            users[0].password=null;
            users[0]["public_key"] = req.headers["x-access-token"];
            return res.json(users[0]);
        } catch (error) {
            console.log(error);
            return customExceptions.throwError(res); 
        }
	}); 



	router.get('/test', async (req: any, res: Response, next: NextFunction) => {
        const mailService = new services.MailService(await getSchema())
        await sendMail(mailService, "mstx777@gmail.com", "Test", {title: "Testing out", headerText: "ok", content: "Nous testons les mails", btnText: "retourner à l'admin", btnUrl:"https://cryptomarket-ci.com"})
        res.json({})
	});


    // const { ItemsService,  } = services;
	// const { ServiceUnavailableException } = exceptions;

    // router.get('/test', (req: any, res: Response, next: NextFunction) => {
        
    //     console.log(req.query.fields);
	// 	const recipeService = new ItemsService('users', { schema: req.schema, accountability: req.accountability });

	// 	recipeService
	// 		.readByQuery(req.query)
	// 		.then((results: any) => res.json(results))
	// 		.catch((error: any) => {
	// 			return next(new ServiceUnavailableException(error.message));
	// 		});
	// });
};
