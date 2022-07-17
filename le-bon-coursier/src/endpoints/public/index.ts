import express, { Router, Response, Request } from "express";
import { getHost } from "../../helpers/utils";
const path = require('path');
export default (router: Router, { services, exceptions, getSchema, database, env }: Record<string, any>) => {
	router.use("/static", express.static('./extensions/static')); 
	router.get('/logo', async (req: Request, res: Response, next) => {  
		const [ settings ] = await database('directus_settings').where('id', '=', 1);
		res.redirect(getHost(req)+`/assets/${settings.project_logo}`);
    }); 
};
