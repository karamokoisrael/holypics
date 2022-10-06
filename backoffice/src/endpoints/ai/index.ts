import { Router } from "express";
import { ApiExtensionContext } from '@directus/shared/types';
import proxy from 'express-http-proxy';
import { getRequestParams } from '../../helpers/request-handler';
import express from "express";

export default function (router: Router, { database }: ApiExtensionContext) {

        const accessForbiddenPath = "?access_token=XXXXXX"

        function selectProxyHost(req: any) {
                const noAuthAccess = true;
                const { accountability } = getRequestParams(req);
                return accountability?.user || noAuthAccess ? process.env.TF_SERVING_API_URL as string : accessForbiddenPath;
        }

        // @ts-ignore
        router.use(express.json({ limit: "10mb", extended: true }))

        router.use(express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }))

        router.use('/', proxy(selectProxyHost, {
                limit: '100mb',
                proxyReqOptDecorator: function (proxyReqOpts: Record<string, any>, srcReq: any) {
                        // you can update headers
                        proxyReqOpts.headers['Content-Type'] = 'application/json';
                        // you can change the method
                        // proxyReqOpts.method = 'GET';
                        return proxyReqOpts;
                },
                proxyReqBodyDecorator: function (bodyContent: Record<string, any>, srcReq: any) {
                        if (bodyContent.instance) bodyContent.instances = [bodyContent.instance]
                        return bodyContent;
                },
                
                proxyReqPathResolver: function (req) {
                        return new Promise(async function (resolve, reject) {
                                try {
                                        const { accountability } = getRequestParams(req);
                                        if (accountability?.user) {
                                                const [{ subscription_deadline }] = await database("directus_users").select("subscription_deadline").where("id", accountability?.user);
                                                resolve(subscription_deadline != null ? req.url.split("?")[0] : accessForbiddenPath);
                                        } else {
                                                resolve(req.url);
                                        }
                                } catch (error) {
                                        console.log(error);
                                        reject(error)
                                }
                        });
                }
        }));
}

