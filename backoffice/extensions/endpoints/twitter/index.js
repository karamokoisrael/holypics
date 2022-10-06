"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_handler_1 = require("./../../helpers/request-handler");
const exceptions_1 = require("./../../helpers/exceptions");
const translation_1 = require("../../helpers/translation");
const directus_1 = require("directus");
const auth_1 = require("../../helpers/auth");
const twitter_api_v2_1 = require("twitter-api-v2");
const twitter_api_v2_2 = require("twitter-api-v2");
const replicate_1 = __importDefault(require("../../helpers/replicate"));
// import { Replicate } from '../../helpers/replicate';
twitter_api_v2_2.TwitterApiV2Settings.deprecationWarnings = false;
const imageToBase64 = require('image-to-base64');
const { Configuration, OpenAIApi } = require("openai");
function default_1(router, { database }) {
    const callbackURL = `${process.env.PUBLIC_URL}/twitter/auth-callback`;
    router.get('/auth', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { t } = yield (0, translation_1.getTranslator)(req, database);
        try {
            const { schema, accountability } = (0, request_handler_1.getRequestParams)(req, true);
            const { admin_id } = yield (0, auth_1.getAdminTokens)(database);
            const configsService = new directus_1.ItemsService("configurations", { schema, accountability: Object.assign(Object.assign({}, accountability), { user: admin_id }) });
            const configs = yield configsService.readSingleton({});
            const { client_id, client_secret } = configs.twitter_settings;
            const twitterClient = new twitter_api_v2_1.TwitterApi({
                clientId: client_id,
                clientSecret: client_secret,
            });
            const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(callbackURL, { scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'] });
            yield configsService.upsertSingleton({ twitter_settings: Object.assign(Object.assign({}, configs.twitter_settings), { code_verifier: codeVerifier, state }) });
            res.redirect(url);
        }
        catch (error) {
            console.log(error);
            return (0, exceptions_1.throwError)(res, t("we_encountered_an_unexpected_error_during_the_operation"));
        }
    }));
    router.get('/auth-callback', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { t } = yield (0, translation_1.getTranslator)(req, database);
        try {
            const { schema, accountability } = (0, request_handler_1.getRequestParams)(req, true);
            const { admin_id } = yield (0, auth_1.getAdminTokens)(database);
            const configsService = new directus_1.ItemsService("configurations", { schema, accountability: Object.assign(Object.assign({}, accountability), { user: admin_id }) });
            const configs = yield configsService.readSingleton({});
            const { state, code } = req.query;
            const { client_id, client_secret, code_verifier, state: storedState } = configs.twitter_settings;
            const twitterClient = new twitter_api_v2_1.TwitterApi({
                clientId: client_id,
                clientSecret: client_secret,
            });
            if (state !== storedState) {
                return (0, exceptions_1.throwError)(res, t("auth_error"));
            }
            const { client: loggedClient, accessToken, refreshToken, } = yield twitterClient.loginWithOAuth2({
                code: code,
                codeVerifier: code_verifier,
                redirectUri: callbackURL,
            });
            yield configsService.upsertSingleton({ twitter_settings: Object.assign(Object.assign({}, configs.twitter_settings), { access_token: accessToken, refresh_token: refreshToken }) });
            const { data } = yield loggedClient.v2.me();
            return { data };
        }
        catch (error) {
            console.log(error);
            return (0, exceptions_1.throwError)(res, t("we_encountered_an_unexpected_error_during_the_operation"));
        }
    }));
    router.get('/publish', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { t } = yield (0, translation_1.getTranslator)(req, database);
        try {
            const { schema, accountability } = (0, request_handler_1.getRequestParams)(req, true);
            const { admin_id } = yield (0, auth_1.getAdminTokens)(database);
            const configsService = new directus_1.ItemsService("configurations", { schema, accountability: Object.assign(Object.assign({}, accountability), { user: admin_id }) });
            const configs = yield configsService.readSingleton({});
            const { client_id, client_secret, refresh_token, openai_key, openai_organization, hugging_face_api_key, prompt_hints, replicate_api_key } = configs.twitter_settings;
            const predictionParams = {
                modelId: "9e767fbac45bea05d5e1823f737f927856c613e18cbc8d9068bafdc6d600a0f7",
                path: "cjwbw/waifu-diffusion",
                input: { prompt: "kid walking", }
            };
            const replicate = new replicate_1.default({ apiToken: replicate_api_key, pollingInterval: 5000 });
            const data = yield replicate.predict(predictionParams.modelId, predictionParams.input);
            console.log(data);
            // If you set the REPLICATE_API_TOKEN environment variable, you do not need to provide a token to the constructor.
            // const replicate = new Replicate();
            // const twitterClient = new TwitterApi({
            //     clientId: client_id,
            //     clientSecret: client_secret,
            // });
            // const {
            //     client: refreshedClient,
            //     accessToken,
            //     refreshToken: newRefreshToken,
            // } = await twitterClient.refreshOAuth2Token(refresh_token);
            // await configsService.upsertSingleton({ twitter_settings: { ...configs.twitter_settings, access_token: accessToken, refresh_token: newRefreshToken } });
            // const configuration = new Configuration({
            //     organization: openai_organization,
            //     apiKey: openai_key,
            // });
            // const openai = new OpenAIApi(configuration);
            // const tweet = await openai.createCompletion('text-davinci-001', {
            //     prompt: 'tweet something cool for #techtwitter',
            //     max_tokens: 64,
            // });
            // const promptReq = await axios.post('https://api-inference.huggingface.co/models/succinctly/text2image-prompt-generator', {
            //     inputs: prompt_hints[Math.floor(Math.random() * prompt_hints.length)]
            // }, { headers: { "Authorization": `Bearer ${hugging_face_api_key}` } })
            // console.log();
            // const imageReq = await axios.post('https://hf.space/embed/hakurei/waifu-diffusion-demo/+/', {
            //     inputs: promptReq.data[0].generated_text
            // }, { headers: { "Authorization": `Bearer ${hugging_face_api_key}` } })
            // console.log(imageReq.data);
            // await refreshedClient.v2.tweet({
            //     text: tweet
            // });
            // const mediaUri = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGh1bWFufGVufDB8fDB8fA%3D%3D&w=1000&q=80'
            // const mediaBase64 = await imageToBase64(mediaUri);
            // const mediaPath = "./uploads/twitter-media.jpg"
            //   Buffer.from(`data:image/jpg;base64,${mediaBase64}`)
            // require("fs").writeFile(mediaPath, mediaBase64, 'base64', async function (err: any) {
            //     const media = await refreshedClient.v1.uploadMedia(mediaPath)
            //     console.log(media);
            // });
            return (0, exceptions_1.successMessage)(res, t("success"));
        }
        catch (error) {
            console.log(error);
            return (0, exceptions_1.throwError)(res, t("we_encountered_an_unexpected_error_during_the_operation"));
        }
    }));
}
exports.default = default_1;
