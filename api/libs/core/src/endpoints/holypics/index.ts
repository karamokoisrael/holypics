/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ApiExtensionContext } from "@directus/shared/types";
import express, { Request, Response, Router } from "express";
import axios from "axios";
import { throwError } from "../../helpers/exceptions";
import { getTranslator } from "../../helpers/translation";

export default function (router: Router, { database }: ApiExtensionContext) {
  // @ts-ignore
  router.use(express.json({ limit: "10mb", extended: true }));

  router.use(
    express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
  );

  router.post("/predict", async (req: Request, res: Response) => {
    const { t } = await getTranslator(req, database);
    // type HolypicsSetting = {
    //   models_paths: string[];
    // };
    try {
      // const { schema, accountability } = getRequestParams(req, true);
      // const { admin_id } = await getAdminTokens(database);
      // const configsService = new ItemsService("configurations", {
      //   schema,
      //   accountability: { ...accountability, user: admin_id as string },
      // });
      // const configs = await configsService.readSingleton({});
      // const { models_paths } = configs.holypics_settings as HolypicsSetting;
      const models_paths = ["/v1/nsfw_detector"];
      const reqBody = req.body.base64
        ? { instances: [req.body.base64] }
        : req.body;
      const requests: Promise<any>[] = [];
      for (const modelPath of models_paths) {
        requests.push(
          axios.post(
            `${process.env.TF_SERVING_API_URL as string}${modelPath}`,
            reqBody
          )
        );
      }
      const predictions: Record<string, any>[] = [];
      const responses = await axios.all(requests);
      for (const response of responses) {
        const predictionData = {} as Record<string, any>;
        for (let i = 0; i < response.data.predictions.length; i++) {
          const prediction = response.data.predictions[i];
          for (let u = 0; u < prediction.classes.length; u++) {
            predictionData[prediction.classes[u]] = prediction.scores[u];
          }
          predictions[i] = { ...predictions[i], ...predictionData };
        }
      }
      return res.json(predictions);
    } catch (error) {
      console.log(error);
      return throwError(
        res,
        t("we_encountered_an_unexpected_error_during_the_operation")
      );
    }
  });
}
