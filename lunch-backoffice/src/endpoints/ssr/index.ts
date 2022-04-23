import { getAdminTokens, getDirectusStatic } from './../../helpers/auth'; 
import { ApiExtensionContext } from '@directus/shared/types';
import { Router, Request, Response } from "express";
import { throwError, throwViewError } from '../../helpers/exceptions';
import { getRequestParams } from '../../helpers/request-handler'
import { renderTemplate } from '../../helpers/template';
import { Knex } from 'knex';


export default (router: Router, { services, exceptions, getSchema, database, env }: ApiExtensionContext) => {

    router.get('/', async (req: Request, res: Response) => {
        try {
            // https://github.com/StartBootstrap/startbootstrap-sb-admin-2
            renderTemplate(req, res, 
                {
                    title: "ssr", 
                    menu_list: [
                        {
                            group: "",
                            name: "test",
                            path: "/"
                        },
                        {
                            group: "",
                            name: "testccs",
                            path: "/"
                        }
                    ]
                },
                "ssr",
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
