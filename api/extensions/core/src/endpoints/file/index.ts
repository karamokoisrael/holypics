import { ApiExtensionContext } from "@directus/shared/types";
import { Router, Request, Response } from "express";
import { throwError } from "../../helpers/exceptions";

export default (router: Router, { database }: ApiExtensionContext) => {
  router.get("/:id", async (req: Request, res: Response) => {
    try {
      // const { access_token } = await getAdminTokens(database);
      // res.redirect(getHost(req)+`/assets/${req.params.id}?access_token=${access_token}`);
      const [file]: Record<string, any>[] = await database(
        "directus_files"
      ).where({ id: req.params.id });
      res.sendFile(
        `${__dirname.replace("extensions/endpoints/file", "")}/uploads/${
          (file as any).filename_disk
        }`
      );
    } catch (error) {
      // console.log(error);
      // return throwError(res);
      res.status(204).send();
    }
  });

  router.get("/tmp/download", async (req: Request, res: Response) => {
    try {
      res.sendFile(
        `${__dirname.replace("extensions/endpoints/file", "")}/uploads/tmp/${
          req.query.path
        }`
      );
    } catch (error) {
      console.log(error);
      return throwError(res);
    }
  });
};
