import { getRequestParams } from './../../helpers/request-handler';
import { generateVerificationCode, getAdminTokens, secureUserData, getDirectus } from './../../helpers/auth'; 
import { ApiExtensionContext } from '@directus/shared/types';
import { Router, Request, Response, NextFunction } from "express";
import { sendMail } from "../../helpers/mailer"
import { throwError, successMessage, throwErrorMessage } from '../../helpers/exceptions';
import Joi from "joi";
import { v4 } from "uuid";
import { random } from "../../helpers/string";
import * as authHandler from "../../helpers/auth";
import { getHost } from "../../helpers/utils";
import { getJoiError } from '../../helpers/validation';
import User from '../../@types/user';
import { uploadBase64File } from '../../helpers/request-handler';
import { AuthenticationService, ItemsService, UsersService } from 'directus';


export default (router: Router, { services, exceptions, getSchema, database, env }: ApiExtensionContext) => {
    
    router.post('/register', async (req: Request, res: Response) => {
        try {

            const validationSchema = Joi.object({

                first_name: Joi.string().label("Veuillez un prénom correcte").required(),

                last_name: Joi.string().label("Veuillez un nom correcte").required(),

                city: Joi.number().label("Veuillez sélectionner une ville").required(),

                email: Joi.string()
                .email()
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
  
            if(validationResult.error) return throwError(res, getJoiError(validationResult), 400);
    
            const memeEmails = await database('directus_users').where('email', '=', req.body.email).count({ total: 'id' });
            if(memeEmails.length > 0 && memeEmails[0].total != 0) return throwError(res, "Email déjà pris par un autre utilisateur", 409); 
            
            const memePhones = await database('directus_users').where('phone_number', '=', req.body.phone).count({ total: 'id' });
            if(memePhones.length > 0 && memePhones[0].total != 0) return throwError(res, "Numéro de téléphone déjà pris par un autre utilisateur", 409); 
            
            const { access_token } = await getAdminTokens(database);
            const directus = await authHandler.getDirectusStatic(req, access_token)
            const otp = random(5, "number");
            const verificationCode = v4();
            
            const [ customerRole ] = await database("directus_roles").select("id").whereIn("name", ["customer", "customer", "Customers"]).limit(1);
            
            const payload = {
                email: req.body.email.toLowerCase(), 
                phone: req.body.phone, 
                password: req.body.password, 
                first_name: req.body.first_name, 
                last_name: req.body.last_name, 
                city: req.body.city,  
                public_key: v4(), 
                otp: otp, 
                verification_code: verificationCode, 
                role: customerRole.id
                // language: DIRECTUS_DEFAULT_LANGUAGE
            }

            directus.users.createOne(payload);

            // const encryptedPassword = await hash(req.body.password, PASSWORD_ENCRYPTION_SALT);
            
            
            // await database('directus_users').insert({email: req.body.email.toLowerCase(), phone: req.body.phone, password: encryptedPassword, first_name: req.body.first_name, last_name: req.body.last_name, city: req.body.city,  public_key: v4(), otp: otp, verification_code: verificationCode})

            const mailService = new services.MailService(await getSchema())
            const mailData = { headerText: "Confirmation d'email", content: "Cliquez sur le bouton ci-dessous pour confirmer votre email", btnText: "Confirmer mon email", btnUrl: getHost(req)+`/views/user/confirm-email?email=${req.body.email}&verificationCode=${verificationCode}` };
           
            await sendMail(mailService, req.body.email, "Confirmation d'email", mailData)
            
            return successMessage(res, "Inscription réussie. Veuillez vous connecter");
            
        } catch (error) {
            console.log(error);
            return throwError(res); 
        }
	
    }); 

    router.post('/resendEmailConfirmationLink', async (req: Request, res: Response) => {
        try {

            const validationSchema = Joi.object({
                email: Joi.string()
                .required()
                .label("Veuillez entrer une adresse email"),
            })
    
            const validationResult = validationSchema.validate(req.body);
            
            if(validationResult.error) return throwError(res, getJoiError(validationResult), 400);

            const [ user ] = await database<User>('directus_users')
            .where("email", "=", req.body.email)
            
            if(user.email_verified){
                return throwError(res, "Adresse email déjà vérifiée", 409);
            }else{
                const verificationCode = await generateVerificationCode(database, user.id);
                const mailService = new services.MailService(await getSchema())
                const mailData = { headerText: "Confirmation d'email", content: "Cliquez sur le bouton ci-dessous pour confirmer votre email", btnText: "Confirmer mon email", btnUrl: getHost(req)+`/views/user/confirm-email?email=${req.body.email}&verificationCode=${verificationCode}` };
                await sendMail(mailService, req.body.email, "Confirmation d'email", mailData)
                successMessage(res, "un mail de confirmation vous a été envoyé")
            }
            
        } catch (error) {
            console.log(error);
            
            return throwError(res); 
        }
	}); 

    router.post('/login', async (req: Request, res: Response) => {
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
            if(validationResult.error) return throwError(res, validationResult.error.details[0].context.label, 400);

            const [ userData ] = await database<User>('directus_users')
            .where("email", "=", req.body.username)
            .orWhere("phone_number", "=",req.body.username)
    
            if(userData.status != "active") return throwError(res, userData.status == "archived" ?
             "Ce compte a été supprimé. Contactez l'administrateur pour plus d'informations" :
             "Ce compte a été bloqué. Contactez l'administrateur pour plus d'informations"
             , 409); 
            const { authResult } = await getDirectus(req, userData.email, req.body.password);
            return res.json(secureUserData(userData, null, {token: authResult.access_token, refresh_token: authResult.refresh_token}));

        } catch (error) {
            console.log(error)
            return throwError(res, "Mauvais non d'utilisateur ou mot de passe"); 
        }
	}); 

    router.post('/passwordForgotten', async (req: Request, res: Response) => {
        try { 
            const [ user ] = await database<User>('directus_users').where('email', '=', req.body.email as string)
            if(user.status != "active") return throwError(res, "Ce compte a été bloqué. Contactez l'administrateur pour plus d'informations"); 
            const verificationCode = await generateVerificationCode(database, user.id, null, user.alert_level, true);
            const mailService = new services.MailService(await getSchema())
            const mailData = { headerText: "Réinitialisation de mot de passe", content: "Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe", btnText: "Réinitialiser", btnUrl: getHost(req)+`/views/user/reinit-password?email=${user.email}&verificationCode=${verificationCode}` };
            await sendMail(mailService, req.body.email, "Réinitialisation de mot de passe", mailData)
            successMessage(res, "Un mail de réinitialisation vous a été envoyé");
        } catch (error) {
            return throwError(res, "Nous avons rencontré une erreur lors de l'opération. Vérifiez que votre adresse email correspond à celle d'un utilisateur inscris"); 
        }
	}); 

    router.post('/passwordReset', async (req: Request, res: Response) => {
        try { 
            const validationSchema = Joi.object({
                email: Joi.string()
                .email()
                .required()
                .label("Veuillez entrer une adresse email valide"),
    
                password: Joi.string()
                .pattern(new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"))
                .required()
                .label("Veuillez entrer un mot de passe contenant au moins un caractère spécial, une lettre et un chiffre"),
    
                verificationCode: Joi.string()
                .required()
                .label("Accès interdit"),
            })
    
            const validationResult = validationSchema.validate(req.body);
            
            if(validationResult.error) return throwError(res, getJoiError(validationResult), 400);

            const { access_token } = await getAdminTokens(database);
            const directus = await authHandler.getDirectusStatic(req, access_token)
            const encryptedPassword = await directus.utils.hash.generate(req.body.password);
            await database('directus_users').update({ password: encryptedPassword, verification_code: v4() }).where('email', '=', req.body.email as string).where('verification_code', '=', req.body.verificationCode as string);

            successMessage(res, "Mot de passe mis à jour");
        } catch (error) {
            return throwError(res); 
        }
	}); 

    router.get('/getData', async (req: Request, res: Response) => {
        try { 

            const { decoded, token } = authHandler.decodeToken(req);
            const [ user ] = await database<User>('directus_users').where("id", "=", decoded?.id as string)
            res.json(secureUserData(user, null, { token: token}))
        } catch (error) {
            console.log(error);
            
            return throwError(res); 
        }
	}); 

    router.put('/updateData', async (req: Request, res: Response) => {
        try { 
            const validationSchema = Joi.object({

                first_name: Joi.string().label("Veuillez un prénom correcte").required(),

                last_name: Joi.string().label("Veuillez un nom correcte").required(),

                phone: Joi.string().required()
                // .pattern(new RegExp('^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$'))
                .label("Veuillez entrer un numéro de téléphone validate"),

                email: Joi.string()
                .email()
                .required()
                .label("Veuillez entrer une adresse email valide"),

                city: Joi.number().label("Veuillez sélectionner une ville"),

                address: Joi.string().allow('').allow(null).optional().label("Veuillez entrer une adresse correcte"),

                address_2: Joi.string().allow('').allow(null).optional().label("Veuillez entrer une seconde adresse 2 correcte"),

                country: Joi.number().allow('').allow(null).optional().label("Veuillez entrer un pays correcte"),

                state: Joi.number().allow('').allow(null).optional().label("Veuillez entrer une région correcte"),

                commune: Joi.number().allow('').allow(null).optional().label("Veuillez entrer une commune correcte"),
            
            })

            const validationResult = validationSchema.validate(req.body);

            if(validationResult.error) return throwError(res, getJoiError(validationResult), 400);

            const { decoded, token } = authHandler.decodeToken(req);

            const [ user ] = await database<User>('directus_users').where("id", "=", decoded?.id as string)

            if(req.body.phone != user.phone_number){
                const memePhones = await database('directus_users').where('phone_number', '=', req.body.phone).count({ total: 'id' });
                if(memePhones.length > 0 && memePhones[0].total != 0) return throwError(res, "Numéro de téléphone déjà pris par un autre utilisateur", 409);
            }

            if(req.body.email != user.email){
                const memeEmails = await database('directus_users').where('email', '=', req.body.email).count({ total: 'id' });
                if(memeEmails.length > 0 && memeEmails[0].total != 0 ) return throwError(res, "Email déjà pris par un autre utilisateur", 409);
                const verificationCode = await generateVerificationCode(database, user.id);
                const mailService = new services.MailService(await getSchema())
                const mailData = { headerText: "Confirmation d'email", content: "Cliquez sur le bouton ci-dessous pour confirmer votre email", btnText: "Confirmer mon email", btnUrl: getHost(req)+`/views/user/confirm-email?email=${req.body.email}&verificationCode=${verificationCode}` };
                await sendMail(mailService, req.body.email, "Confirmation d'email", mailData)
            }

            req.body.phone_number = req.body.phone;
            delete req.body.phone;

            await database("directus_users").update(req.body).where("id", "=", decoded?.id as string);
            const { schema, accountability } = getRequestParams(req);
            const userService = new UsersService({ knex: database, schema, accountability})
            // await userService.updateOne(decoded?.id as string, req.body);
            
            const updatedUser = await userService.readOne(decoded?.id as string);
            return res.json(secureUserData(updatedUser, req));

        } catch (error) {
            console.log(error);
            return throwError(res); 
        }
	}); 

    router.put('/updatePassword', async (req: Request, res: Response) => {
        try { 
            const validationSchema = Joi.object({

                password: Joi.string().required().required().label("Veuillez un mot de passe actuel correcte"),

                new_password: Joi.string()
                .pattern(new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"))
                .required()
                .label("Veuillez entrer un  nouveau mot de passe contenant au moins un caractère spécial, une lettre et un chiffre"),
            })


            const { password, new_password } = req.body;
            const validationResult = validationSchema.validate(req.body);

            if(validationResult.error) return throwError(res, getJoiError(validationResult), 400);

            const { decoded } = authHandler.decodeToken(req);
            const userId = decoded?.id as string;
            const { schema, accountability } = getRequestParams(req);
            const authenticationService = new AuthenticationService({ knex: database, schema, accountability})
            await authenticationService.verifyPassword(userId, password)
    
            const { access_token } = await getAdminTokens(database);
            const directus = await authHandler.getDirectusStatic(req, access_token)
            const encryptedPassword = await directus.utils.hash.generate(new_password);
            
            await database('directus_users').update({password: encryptedPassword}).where("id", "=", userId);
            return successMessage(res, "Mot de passe mis à jour avec succès")
        } catch (error: any) {
            throwErrorMessage(res, error?.code, "Mauvais mot de passe");
        }
	});

    router.put('/updateProfilPic', async (req: Request, res: Response) => {
        try { 

            const { decoded } = authHandler.decodeToken(req);
    
            const { access_token } = await getAdminTokens(database);

            const validationSchema = Joi.object({
                avatar: Joi.string().required().label("Veuillez sélectionner une image de profil valide"),
            })

            const validationResult = validationSchema.validate(req.body);

            if(validationResult.error) return throwError(res, getJoiError(validationResult), 400);

            const response = await uploadBase64File(req, req.body.avatar, access_token) as Record<string, any>;
            await database('directus_users').update({avatar: response.data.id}).where("id", "=", decoded?.id as string);
            const { schema, accountability } = getRequestParams(req);
            const userService = new UsersService({ knex: database, schema, accountability})
            const updatedUser = await userService.readOne(decoded?.id as string);
            return res.json(secureUserData(updatedUser, req));
        } catch (error) {
            console.log(error);
            return throwError(res); 
        }
	}); 

    router.delete('/deleteAccount', async (req: Request, res: Response) => {
        try { 
            const { decoded } = authHandler.decodeToken(req);
            await database<User>('directus_users').update({ status: "archived"}).where("id", "=", decoded?.id as string)
            res.json({data: {id: decoded?.id}, message: "Opération effectuée avec succès"})
        } catch (error) {
            return throwError(res); 
        }
	}); 

};
