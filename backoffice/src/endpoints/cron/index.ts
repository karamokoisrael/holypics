import { NextFunction, Request, Response, Router } from "express";
import { dump, getDumpList, restore } from "../../helpers/db"
export default function (router: Router){
        
	router.get('/db-backup', async (req: Request, res: Response, next: NextFunction) => {
                dump();
                return res.json({message: "done"});   
	});

        router.get('/db-restore', async (req: Request, res: Response, next: NextFunction) => {
                restore();
                return res.json({message: "done"});          
	})


} 