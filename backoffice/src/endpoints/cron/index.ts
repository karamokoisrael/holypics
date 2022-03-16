import { NextFunction, Request, Response, Router } from "express";
import { dump, getDumpList, restore } from "../../helpers/db"
const cron = require('node-cron');

cron.schedule('0 0 5 * *', () => {
        console.log('updating rentals on the 5 of each month');
});

cron.schedule('0 0 1 1/1 * ? *', () => {
        console.log('saving databases everyday');
        dump();
});

export default function (router: Router){        
	router.get('/db-backup', async (req: Request, res: Response, next: NextFunction) => {
                dump();
                return res.json({message: "done"});   
	});

        router.get('/get-backup-list', async (req: Request, res: Response, next: NextFunction) => {
                getDumpList((list: Array<string>)=>{
                        return res.json(list);   
                });

                return [];     
	});

        router.get('/db-restore', async (req: Request, res: Response, next: NextFunction) => {
                restore();
                return res.json({message: "done"});          
	})


} 