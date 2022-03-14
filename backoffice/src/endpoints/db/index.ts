import { NextFunction, Request, Response, Router } from "express";
import { dump, getDumpList, restore } from "../../helpers/db";
import { successMessage } from "../../helpers/exceptions";

export default function (router: Router){
	router.get('/delete-backup/:id', async (req: Request, res: Response, next: NextFunction) => {
        console.log(req.params["id"]);
        
        successMessage(res);
	});

    router.get('/get-backup-list', async (req: Request, res: Response, next: NextFunction) => {
            getDumpList((list: Array<string>)=>{
                    return res.json(list);   
            });

            return [];   
            
	});

        router.get('/db-restore', async (req: Request, res: Response, next: NextFunction) => {
                restore();
                successMessage(res);       
	})


} 