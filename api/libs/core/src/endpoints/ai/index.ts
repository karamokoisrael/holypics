/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ApiExtensionContext } from "@directus/shared/types";
import proxy from "express-http-proxy";
import { getRequestParams } from "../../helpers/request-handler";
import express, { Router } from "express";

export default function (router: Router, { database }: ApiExtensionContext) {
  const accessForbiddenPath = "?access_token=XXXXXX";

  function selectProxyHost(req: any) {
    const noAuthAccess = true;
    const { accountability } = getRequestParams(req);
    return accountability?.user || noAuthAccess
      ? (process.env.TF_SERVING_API_URL as string)
      : accessForbiddenPath;
  }

  // @ts-ignore
  router.use(express.json({ limit: "10mb", extended: true }));

  router.use(
    express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
  );

  router.use(
    "/",
    proxy(selectProxyHost, {
      limit: "100mb",
      proxyReqOptDecorator: function (
        proxyReqOpts: Record<string, any>,
        _srcReq: any
      ) {
        // you can update headers
        proxyReqOpts.headers["Content-Type"] = "application/json";
        // you can change the method
        // proxyReqOpts.method = 'GET';
        return proxyReqOpts;
      },
      proxyReqBodyDecorator: function (
        bodyContent: Record<string, any>,
        _srcReq: any
      ) {
        if (bodyContent.instance)
          bodyContent.instances = [bodyContent.instance];
        return bodyContent;
      },

      proxyReqPathResolver: function (req) {
        return new Promise(function (resolve, reject) {
          const { accountability } = getRequestParams(req);
          if (accountability?.user) {
            database("directus_users")
              .select("subscription_deadline")
              .where("id", accountability?.user)
              .then((data: any) => {
                const [{ subscription_deadline }] = data;
                //   @ts-ignore
                resolve(
                  // @ts-ignore
                  subscription_deadline != null
                    ? // @ts-ignore
                      req.url.split("?")[0]
                    : // @ts-ignore
                      accessForbiddenPath
                );
              })
              .catch((error) => {
                reject(error);
              });
          } else {
            resolve(req.url);
          }
        });
      },
    })
  );
}
