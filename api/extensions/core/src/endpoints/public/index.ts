import express, { Router, Response, Request } from "express";
import { getHost } from "../../helpers/utils";
export default (router: Router, { database }: Record<string, any>) => {
	router.use("/static", express.static('./extensions/static')); 
	router.get('/logo', async (req: Request, res: Response) => {  
		const [ settings ] = await database('directus_settings').where('id', '=', 1);
		res.redirect(getHost(req)+`/assets/${settings.project_logo}`);
    }); 
};
