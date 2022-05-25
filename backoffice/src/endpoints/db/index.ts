import { getDirectusStatic } from './../../helpers/auth';
import { responseWithId, responseWithSingleKey } from './../../helpers/exceptions';
import { NextFunction, Request, Response, Router } from "express";
import { deleteBackup, dump, getDumpList, restore } from "../../helpers/db";
import { ApiExtensionContext } from '@directus/shared/types';
const AdmZip = require("adm-zip");
const fs = require('fs');
const multer = require('multer')


export default function (router: Router, { services, exceptions, getSchema, database, env }: ApiExtensionContext) {

        router.get('/getBackupList', async (req: Request, res: Response) => {
                try {
                        const directus = await getDirectusStatic(req, req.query.access_token as string)
                        const settings = await directus.server.info()
                        if (settings.os == undefined) return res.status(400).json({ message: "You don't have the right to perform this action" })
                        const list = await getDumpList();
                        return res.json(list);
                } catch (error) {
                        console.log(error);
                        res.status(400).json({ message: "You don't have the right to perform this action" })
                }

        });

        router.delete('/deleteBackup/:id', async (req: Request, res: Response) => {
                try {
                        const directus = await getDirectusStatic(req, req.query.access_token as string)
                        const settings = await directus.server.info()
                        if (settings.os == undefined) return res.status(400).json({ message: "You don't have the right to perform this action" })
                        const id = req.params["id"]
                        deleteBackup(id, (...params: Array<any>) => {
                                responseWithId(res, id);
                                // responseWithSingleKey(res, "params", params)
                        });
                } catch (error) {
                        res.status(400).json({ message: "You don't have the right to perform this action" })
                }

        });

        router.post('/restore/:id', async (req: Request, res: Response) => {
                try {
                        const directus = await getDirectusStatic(req, req.query.access_token as string)
                        const settings = await directus.server.info()
                        if (settings.os == undefined) return res.status(400).json({ message: "You don't have the right to perform this action" })
                        const id = req.params["id"]
                        // dump() 
                        restore(id);
                        responseWithId(res, id);
                } catch (error) {
                        console.log(error);
                        res.status(400).json({ message: "You don't have the right to perform this action" })
                }
        })

        router.get('/downloadBackup/:id', async (req: Request, res: Response) => {
                try {
                        const directus = await getDirectusStatic(req, req.query.access_token as string)
                        const settings = await directus.server.info()
                        if (settings.os == undefined) return res.status(400).json({ message: "You don't have the right to perform this action" })
                        const id = req.params["id"]
                        const file = `./migration/${id.replace(".sql", "")}.sql`;
                        res.download(file);
                } catch (error) {
                        res.status(400).json({ message: "You don't have the right to perform this action" })
                }

        })

        router.get('/downloadUploads', async (req: Request, res: Response) => {
                try {
                        const directus = await getDirectusStatic(req, req.query.access_token as string)
                        const settings = await directus.server.info()
                        if (settings.os == undefined) return res.status(400).json({ message: "You don't have the right to perform this action" })
                        const id = req.params["id"]
                        const zip = new AdmZip();
                        const file = `./migration/uploads_${new Date().toString().replace(/ /g, '_')}.zip`;
                        zip.addLocalFolder("./uploads");
                        zip.writeZip(file);
                        console.log(`Created ${file} successfully`);
                        res.download(file);
                } catch (error) {
                        res.status(400).json({ message: "You don't have the right to perform this action" })
                }

        })

        router.get('/dump', async (req: Request, res: Response) => {
                try {
                        const directus = await getDirectusStatic(req, req.query.access_token as string)
                        const settings = await directus.server.info()
                        if (settings.os == undefined) return res.status(400).json({ message: "You don't have the right to perform this action" })
                        dump()
                        res.json({ message: "Opération effectuée avec succès" })
                } catch (error) {
                        res.status(400).json({ message: "You don't have the right to perform this action" })
                }
        })

        router.post('/dump', async (req: Request, res: Response) => {
                try {
                        const directus = await getDirectusStatic(req, req.query.access_token as string)
                        const settings = await directus.server.info()
                        if (settings.os == undefined) return res.status(400).json({ message: "You don't have the right to perform this action" })
                        dump()
                        res.json({ message: "Opération effectuée avec succès" })
                } catch (error) {
                        res.status(400).json({ message: "You don't have the right to perform this action" })
                }
        })

        router.get('/downloadSqlite3', async (req: Request, res: Response) => {
                try {
                        const directus = await getDirectusStatic(req, req.query.access_token as string)
                        const settings = await directus.server.info()
                        if (settings.os == undefined) return res.status(400).json({ message: "You don't have the right to perform this action" })
                        const file = `${process.env.DB_FILENAME}`;
                        res.download(file);
                } catch (error) {
                        res.status(400).json({ message: "You don't have the right to perform this action" })
                }

        })

        router.post('/uploadSqlite3', multer().single('file'), async (req: Request, res: Response) => {
                try {
                        const directus = await getDirectusStatic(req, req.query.access_token as string)
                        const settings = await directus.server.info()
                        if (settings.os == undefined) return res.status(400).json({ message: "You don't have the right to perform this action" })
                        fs.unlink(`${process.env.DB_FILENAME}`, ()=>{
                                fs.createWriteStream(process.env.DB_FILENAME).write(( req as Record<string, any>).file.buffer);
                        })                        
                        res.json({ message: "Opération effectuée avec succès" })
                } catch (error) {
                        res.status(400).json({ message: "You don't have the right to perform this action" })
                }
        })

        router.post('/uploadSql', multer().single('file'), async (req: Request, res: Response) => {
                try {
                        const directus = await getDirectusStatic(req, req.query.access_token as string)
                        const settings = await directus.server.info()
                        if (settings.os == undefined) return res.status(400).json({ message: "You don't have the right to perform this action" })
                        await database.raw(( req as Record<string, any>).file.buffer.toString('utf8'));                    
                        res.json({ message: "Opération effectuée avec succès" })
                } catch (error) {
                        console.log(error);
                        res.status(400).json({ message: "You don't have the right to perform this action" })
                }
        })

}

