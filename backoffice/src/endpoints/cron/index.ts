import { NextFunction, Request, Response, Router } from "express";
import { dump, getDumpList, restore } from "../../helpers/db"
export default function (router: Router){
        router.use(()=>{
                setInterval(()=>{
                        console.log("using");
                }, 3000)
        })
        
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