import { responseWithId, responseWithSingleKey } from './../../helpers/exceptions';
import { NextFunction, Request, Response, Router } from "express";
import { deleteBackup, dump, getDumpList, restore } from "../../helpers/db";

export default function (router: Router){
        
	router.delete('/delete-backup/:id', async (req: Request, res: Response, next: NextFunction) => {
                const id = req.params["id"]
                deleteBackup(id, (...params: Array<any>)=>{
                        responseWithId(res, id);
                        // responseWithSingleKey(res, "params", params)
                });
	});

        // router.get('/get-backup-list', async (req: Request, res: Response, next: NextFunction) => {
        //     getDumpList((list: Array<string>)=>{
        //             return res.json(list);   
        //     });
        //     return [];   
	// });

        router.get('/get-backup-list', async (req: Request, res: Response, next: NextFunction) => {
                getDumpList((list: Array<string>)=>{
                        return res.json(list);   
                });

                return [];   
	});

        router.post('/db-restore/:id', async (req: Request, res: Response, next: NextFunction) => {
                const id = req.params["id"]
                restore(id);
                responseWithId(res, id);      
	})


        router.get('/backup-download/:id', async (req: Request, res: Response, next: NextFunction) => {
                const id = req.params["id"]
                restore(id);
                responseWithId(res, id);      
	})
} 