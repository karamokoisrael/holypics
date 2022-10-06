import { getRequestParams } from './../../helpers/request-handler';
import { successMessage, throwError } from './../../helpers/exceptions';
import { Request, Response, Router } from "express";
import { ApiExtensionContext } from '@directus/shared/types';
import { getTranslator } from '../../helpers/translation';
import { ItemsService } from 'directus';
import axios from 'axios';
import { getAdminTokens } from '../../helpers/auth';
import { TwitterApi } from 'twitter-api-v2';
import { TwitterApiV2Settings } from 'twitter-api-v2';
import Replicate from '../../helpers/replicate';
// import { Replicate } from '../../helpers/replicate';

TwitterApiV2Settings.deprecationWarnings = false;
const imageToBase64 = require('image-to-base64');
const { Configuration, OpenAIApi } = require("openai");

export default function (router: Router, { database }: ApiExtensionContext) {

    type TwitterSetting = {
        api_key: string,
        api_key_secret: string,
        bearer_token: string,
        client_id: string,
        client_secret: string,
        access_token: string,
        refresh_token: string,
        state: string,
        code_verifier: string,
        openai_key: string,
        openai_organization: string,
        hugging_face_api_key: string,
        prompt_hints: string[],
        replicate_api_key: string
    }

    const callbackURL = process.env.PUBLIC_URL != "/" ? `${process.env.PUBLIC_URL}/twitter/auth-callback` :
        `https://mgx-twitter.requestcatcher.com/twitter/auth-callback`;

    router.get('/auth', async (req: Request, res: Response) => {
        const { t } = await getTranslator(req, database);
        try {
            const { schema, accountability } = getRequestParams(req, true);
            const { admin_id } = await getAdminTokens(database);
            const configsService = new ItemsService("configurations", { schema, accountability: { ...accountability, user: admin_id as string } });
            const configs = await configsService.readSingleton({});
            const { client_id, client_secret } = configs.twitter_settings as TwitterSetting;
            const twitterClient = new TwitterApi({
                clientId: client_id,
                clientSecret: client_secret,
            });

            console.log("callback url => ", callbackURL);
            

            const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
                callbackURL,
                { scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'] }
            );

            await configsService.upsertSingleton({ twitter_settings: { ...configs.twitter_settings, code_verifier: codeVerifier, state } });
            return res.redirect(url);
        } catch (error) {
            console.log(error);
            return throwError(res, t("we_encountered_an_unexpected_error_during_the_operation"));
        }

    });

    router.get('/auth-callback', async (req: Request, res: Response) => {
        const { t } = await getTranslator(req, database);
        try {
            const { schema, accountability } = getRequestParams(req, true);
            const { admin_id } = await getAdminTokens(database);
            const configsService = new ItemsService("configurations", { schema, accountability: { ...accountability, user: admin_id as string } });
            const configs = await configsService.readSingleton({});
            const { state, code } = req.query;
            const { client_id, client_secret, code_verifier, state: storedState } = configs.twitter_settings as TwitterSetting;
            const twitterClient = new TwitterApi({
                clientId: client_id,
                clientSecret: client_secret,
            });

            if (state !== storedState) {
                return throwError(res, t("auth_error"));
            }

            const {
                client: loggedClient,
                accessToken,
                refreshToken,
            } = await twitterClient.loginWithOAuth2({
                code: code as string,
                codeVerifier: code_verifier as string,
                redirectUri: callbackURL,
            });

            await configsService.upsertSingleton({ twitter_settings: { ...configs.twitter_settings, access_token: accessToken, refresh_token: refreshToken } });
            const { data } = await loggedClient.v2.me();
            return { data };
        } catch (error) {
            console.log(error);
            return throwError(res, t("we_encountered_an_unexpected_error_during_the_operation"));
        }

    });

    router.get('/publish', async (req: Request, res: Response) => {
        const { t } = await getTranslator(req, database);
        try {

            const { schema, accountability } = getRequestParams(req, true);
            const { admin_id } = await getAdminTokens(database);
            const configsService = new ItemsService("configurations", { schema, accountability: { ...accountability, user: admin_id as string } });
            const configs = await configsService.readSingleton({});
            const { client_id, client_secret, refresh_token, openai_key, openai_organization, hugging_face_api_key, prompt_hints, replicate_api_key } = configs.twitter_settings as TwitterSetting;



            const twitterClient = new TwitterApi({
                clientId: client_id,
                clientSecret: client_secret,
            });

            const {
                client: refreshedClient,
                accessToken,
                refreshToken: newRefreshToken,
            } = await twitterClient.refreshOAuth2Token(refresh_token);
            await configsService.upsertSingleton({ twitter_settings: { ...configs.twitter_settings, access_token: accessToken, refresh_token: newRefreshToken } });

            // const configuration = new Configuration({
            //     organization: openai_organization,
            //     apiKey: openai_key,
            // });
            // const openai = new OpenAIApi(configuration);
            // const tweet = await openai.createCompletion('text-davinci-001', {
            //     prompt: 'tweet something cool for #techtwitter',
            //     max_tokens: 64,
            // });

            const wordHint = prompt_hints[Math.floor(Math.random() * prompt_hints.length)]
            // const promptReq = await axios.post('https://api-inference.huggingface.co/models/succinctly/text2image-prompt-generator', {
            //     inputs: wordHint
            // }, { headers: { "Authorization": `Bearer ${hugging_face_api_key}` } })

            const generatedPrompt = wordHint //promptReq.data[0].generated_text

            
            
            console.log("wordHint => ", wordHint);

            console.log("generated_text => ", generatedPrompt);

            
            // await refreshedClient.v2.tweet({
            //     text: generatedPrompt
            // });

            const replicate = new Replicate({ apiToken: replicate_api_key, pollingInterval: 5000 });
            const imagePredictionData = await replicate.predict("9e767fbac45bea05d5e1823f737f927856c613e18cbc8d9068bafdc6d600a0f7", {
                prompt: generatedPrompt
            })

            console.log(imagePredictionData);
            
            const imageUrl = imagePredictionData.output[0]

            console.log("ouput url => ", imageUrl);

            const mediaBase64 = await imageToBase64(imageUrl);
            const mediaPath = "./uploads/twitter-media.jpg"
            Buffer.from(`data:image/jpg;base64,${mediaBase64}`)
            require("fs").writeFile(mediaPath, mediaBase64, 'base64', async function (err: any) {
                const media = await refreshedClient.v1.uploadMedia(mediaPath)
                console.log(media);
            });

            return successMessage(res, t("success"));
        } catch (error) {
            console.log(error);
            return throwError(res, t("we_encountered_an_unexpected_error_during_the_operation"));
        }

    });
}


