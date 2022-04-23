import { ApiExtensionContext } from '@directus/shared/types';
import { Router, Request, Response } from "express";
import { throwViewError } from '../../helpers/exceptions';
import { renderTemplate } from '../../helpers/template';
import { Knex } from 'knex';


export default (router: Router, { services, exceptions, getSchema, database, env }: ApiExtensionContext) => {

    router.get('/', async (req: Request, res: Response) => {
        res.header('Access-Control-Allow-Origin', '*')
        // res.header ('Access-Control-Allow-Credentials', true)
        res.header ('Access-Control-Allow-Methods', 'GET, OPTIONS')
        res.header ('Access-Control-Allow-Headers', 'Content-Type')
        try {
            // https://github.com/StartBootstrap/startbootstrap-sb-admin-2
            renderTemplate(req, res, 
                {
                    product_id: req.query.product_id,
                    user_created: req.query.user_created
                },
                "map",
                "liquid",
                "intl",
                database
            )
        } catch (error) {
            console.log(error);
            
            throwViewError(req, res, "intl", database as Knex | null);
        }
	}); 
    
    router.get('/dump', async (req: Request, res: Response) => {
        try {
            // https://github.com/StartBootstrap/startbootstrap-sb-admin-2
            renderTemplate(req, res, 
                {
            
                },
                "ssr-dump",
                "liquid",
                "intl",
                database
            )
        } catch (error) {
            console.log(error);
            
            throwViewError(req, res, "intl", database as Knex | null);
        }
	}); 

};
