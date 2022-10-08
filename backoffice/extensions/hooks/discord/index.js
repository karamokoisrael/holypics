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
const discord_js_1 = require("discord.js");
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const ping_1 = __importDefault(require("./commands/ping"));
const imageToBase64 = require('image-to-base64');
const axios_1 = __importDefault(require("axios"));
const auth_1 = require("../../helpers/auth");
const uuid_1 = require("uuid");
const fs = require("fs");
const jimp_1 = __importDefault(require("jimp"));
const moment_1 = __importDefault(require("moment"));
function default_1({ action }, { database, emitter }) {
    action('server.start', (meta, { accountability, schema }) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { admin_id } = yield (0, auth_1.getAdminTokens)(database);
            // const filesService = new FilesService({ schema: schema as SchemaOverview, accountability: { ...(accountability as Accountability), user: admin_id as string, admin: true } })
            let [{ discord_settings }] = yield database("configurations").select("discord_settings");
            const { bot_custom_id, store_all_predictions, app_id, bot_token, nfsw_model_path, neutral_class, neutral_class_danger_probability, test_channels, prediction_folder } = JSON.parse(discord_settings);
            const client = new discord_js_1.Client({
                partials: ["CHANNEL"], intents: [
                    discord_js_1.Intents.FLAGS.GUILDS,
                    discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
                    discord_js_1.Intents.FLAGS.DIRECT_MESSAGES,
                    discord_js_1.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
                    discord_js_1.Intents.FLAGS.GUILD_INVITES,
                    discord_js_1.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
                    discord_js_1.Intents.FLAGS.GUILD_INTEGRATIONS,
                    discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
                    discord_js_1.Intents.FLAGS.GUILD_PRESENCES,
                    discord_js_1.Intents.FLAGS.GUILD_WEBHOOKS
                ]
            });
            const commands = [];
            // @ts-ignore
            client.commands = new discord_js_1.Collection();
            const commandsMap = { ping: ping_1.default };
            for (const command of Object.keys(commandsMap)) {
                // @ts-ignore
                client.commands.set(commandsMap[command].data.name, commandsMap[command]);
                // @ts-ignore
                commands.push(commandsMap[command].data.toJSON());
            }
            const isValidUrl = (urlString) => {
                var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
                    '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
                    '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
                    '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
                return !!urlPattern.test(urlString);
            };
            const processUrl = (message, url) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const base64 = yield imageToBase64(url);
                    const predictionReq = yield axios_1.default.post(`${process.env.TF_SERVING_API_URL}${nfsw_model_path}`, { instances: [base64] });
                    const prediction = predictionReq.data.predictions[0];
                    const predictionData = {};
                    let predictionMessage = "";
                    const uuid = (0, uuid_1.v4)();
                    const actionRow = new discord_js_1.MessageActionRow();
                    for (let i = 0; i < prediction.scores.length; i++) {
                        predictionData[prediction.classes[i]] = prediction.scores[i];
                        predictionMessage += `${prediction.classes[i]}: ${(Math.round(prediction.scores[i] * 100))}% \n`;
                        actionRow.addComponents(new discord_js_1.MessageButton()
                            .setStyle("PRIMARY")
                            .setLabel(`${prediction.classes[i]}`)
                            .setCustomId(`${bot_custom_id}_class_${prediction.classes[i]}_id_${uuid}`));
                    }
                    const utilityRow = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                        .setStyle("LINK")
                        .setLabel("See image")
                        // .setCustomId(`${bot_custom_id}_download_image_btn`)
                        .setURL((predictionData[neutral_class] <= neutral_class_danger_probability || store_all_predictions) ? `${process.env.PUBLIC_URL}/file/${uuid}` : url)
                        .setDisabled(false));
                    if (test_channels.includes(message.channel.id))
                        yield message.reply({
                            content: predictionMessage, components: [actionRow, utilityRow]
                        });
                    if (predictionData[neutral_class] <= neutral_class_danger_probability || store_all_predictions) {
                        const fileName = `${bot_custom_id}_pred_${uuid}`;
                        const fileDownloadName = `${fileName}.jpg`;
                        fs.writeFile(`./uploads/${fileDownloadName}`, base64, { encoding: 'base64' }, (err) => __awaiter(this, void 0, void 0, function* () {
                            if (err)
                                return;
                            const buffer = Buffer.from(base64, 'base64');
                            const image = yield jimp_1.default.read(buffer);
                            yield database("directus_files").insert({
                                id: uuid,
                                storage: "local",
                                filename_disk: fileDownloadName,
                                filename_download: fileDownloadName,
                                title: fileDownloadName,
                                folder: prediction_folder,
                                type: "image/jpeg",
                                uploaded_by: admin_id,
                                filesize: buffer.length,
                                width: image.bitmap.width,
                                height: image.bitmap.height,
                                uploaded_on: (0, moment_1.default)(new Date(), "DD-MM-YYYY hh:mm:ss").toDate()
                            });
                            yield database("feedbacks").insert({
                                image: uuid,
                                image_url: url,
                                prediction_data: JSON.stringify(predictionData),
                                date_created: (0, moment_1.default)(new Date(), "DD-MM-YYYY hh:mm:ss").toDate(),
                                user_created: admin_id
                            });
                        }));
                    }
                }
                catch (error) {
                    // console.log(error);
                }
            });
            client.on("ready", () => {
                const guild_ids = client.guilds.cache.map(guild => guild.id);
                const rest = new rest_1.REST({ version: '9' }).setToken(bot_token);
                for (const guildId of guild_ids) {
                    rest.put(v9_1.Routes.applicationGuildCommands(app_id, guildId), { body: commands })
                        .then(() => console.log('Successfully updated commands for guild ' + guildId))
                        .catch(console.log);
                }
                emitter.onAction("holypics_predict_url", (meta) => __awaiter(this, void 0, void 0, function* () {
                    const channel = yield client.channels.fetch(test_channels[0]);
                    // const channel = client.channels.cache.get(test_channels[0]);
                    // @ts-ignore
                    channel.send({ content: meta.imageUrl });
                }));
            });
            client.on('messageCreate', (message) => __awaiter(this, void 0, void 0, function* () {
                if (message.content != null && message.content != undefined && message.content != "" && message.content.startsWith("http") && isValidUrl(message.content))
                    yield processUrl(message, message.content.replace(/ /g, ""));
                if (message.attachments.size == 0)
                    return;
                message.attachments.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                    yield processUrl(message, item.attachment);
                }));
            }));
            client.on("interactionCreate", (interaction) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (interaction.isButton() && interaction.customId.startsWith(`${bot_custom_id}_class_`)) {
                        const idSubstring = interaction.customId.split(`${bot_custom_id}_class_`)[1];
                        const [className, imageId] = idSubstring.split("_id_");
                        yield database("feedbacks").update({ moderation_classes: JSON.stringify([className]) }).where("image", "=", imageId);
                        const components = interaction.message.components;
                        if ((components === null || components === void 0 ? void 0 : components.length) <= 3) {
                            const row = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                                .setStyle("SUCCESS")
                                .setLabel("✔️")
                                .setCustomId(`${bot_custom_id}${(0, uuid_1.v4)()}`)
                                .setDisabled(true));
                            // @ts-ignore
                            components === null || components === void 0 ? void 0 : components.push(row);
                        }
                        return interaction.update({
                            content: interaction.message.content,
                            // @ts-ignore
                            components,
                        });
                    }
                    if (!interaction.isCommand())
                        return;
                    // @ts-ignore
                    const command = client.commands.get(interaction.commandName);
                    if (!command)
                        return;
                    try {
                        yield command.execute(interaction);
                    }
                    catch (error) {
                        console.log(error);
                        // interaction.
                        yield interaction.reply({ content: "There was an error executing this command" });
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }));
            client.login(bot_token);
        }
        catch (error) {
            console.log(error);
        }
    }));
}
exports.default = default_1;
;
