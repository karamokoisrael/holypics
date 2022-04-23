import { Request,Response, Router } from "express";
import { JsonObject } from "../../@types/global";
import { successMessage } from "../../helpers/exceptions";

export default (router: Router, { services, exceptions, getSchema, database, env }: JsonObject) => {
    
    router.get('/get', async (req:Request, res: Response) => { 
        successMessage(res);
    }); 


    router.post('/post', async (req:Request, res: Response) => { 
        successMessage(res);
    }); 


    router.put('/put', async (req:Request, res: Response) => { 
        successMessage(res);
    }); 

    router.delete('/delete', async (req:Request, res: Response) => { 
        successMessage(res);
    }); 

    // router.get('/random', async (req: Request, res: Response, next: NextFunction) => {  
    //     const directusMailder = new services.MailService(await getSchema())
    //     const mailData = { title: "", headerText: "Confirmation d'email", content: "Cliquez sur le bouton ci-dessous pour confirmer votre email", btnText: "Confirmer mon email", btnUrl: process.env.DIRECTUS_URL+"/views/" };
    //     mailer.sendCustomEmail(directusMailder, "mstx777@gmail.com", "Confirmation de compte", mailData);
    //     res.json({})
    // }); 

};