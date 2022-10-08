import { Accountability } from '@directus/shared/types';
import { SchemaOverview } from '@directus/shared/types';
import { ExtendedApiExtensionContext } from './../../@types/directus';
import { RegisterFunctions } from "../../@types/directus";
import { AnyChannel, Client, Collection, Intents, Message } from "discord.js"
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import ping from "./commands/ping";
const imageToBase64 = require('image-to-base64');
import axios from 'axios';
import { FilesService } from 'directus';
import { getAdminTokens } from '../../helpers/auth';
import { v4 } from "uuid";
const { Readable } = require('stream');
const fs = require("")
export default function ({ action }: RegisterFunctions, { database, emitter }: ExtendedApiExtensionContext) {

    type DiscordSetting = {
        app_id: string,
        public_key: string,
        bot_username: string,
        bot_token: string,
        nfsw_model_path: string,
        neutral_class: string,
        neutral_class_danger_probability: number,
        test_channels: string[]
    }

    action('server.start', async (meta, { accountability, schema }) => {
        try {


            const { admin_id } = await getAdminTokens(database);
            const filesService = new FilesService({ schema: schema as SchemaOverview, accountability: { ...(accountability as Accountability), user: admin_id as string, admin: true } })

            let [{ discord_settings }] = await database("configurations").select("discord_settings")
            const { app_id, bot_token, nfsw_model_path, neutral_class, neutral_class_danger_probability, test_channels } = JSON.parse(discord_settings) as DiscordSetting;
            const client = new Client({
                partials: ["CHANNEL"], intents:
                    [
                        Intents.FLAGS.GUILDS,
                        Intents.FLAGS.GUILD_MESSAGES,
                        Intents.FLAGS.DIRECT_MESSAGES,
                        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
                        Intents.FLAGS.GUILD_INVITES,
                        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
                        Intents.FLAGS.GUILD_INTEGRATIONS,
                        Intents.FLAGS.GUILD_MEMBERS,
                        Intents.FLAGS.GUILD_PRESENCES,
                        Intents.FLAGS.GUILD_WEBHOOKS
                    ]
            })

            const commands: Record<string, any>[] = [];
            // @ts-ignore
            client.commands = new Collection();

            const commandsMap = { ping }

            for (const command of Object.keys(commandsMap)) {
                // @ts-ignore
                client.commands.set(commandsMap[command].data.name, commandsMap[command]);
                // @ts-ignore
                commands.push(commandsMap[command].data.toJSON());
            }

            const isValidUrl = (urlString: string) => {
                var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
                    '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
                    '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
                    '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
                return !!urlPattern.test(urlString);
            }

            const processUrl = async (message: Message, url: string) => {
                try {
                    const base64 = await imageToBase64(url);
                    const predictionReq = await axios.post(`${process.env.TF_SERVING_API_URL as string}${nfsw_model_path}`,
                        { instances: [base64] }
                    )
                    const prediction = predictionReq.data.predictions[0];
                    const predictionData = {} as Record<string, any>;
                    let predictionMessage = "";
                    for (let i = 0; i < prediction.scores.length; i++) {
                        predictionData[prediction.classes[i]] = prediction.scores[i];
                        predictionMessage += `${prediction.classes[i]}: ${(Math.round(prediction.scores[i] * 100))}% \n`
                    }

                    if (test_channels.includes(message.channel.id)) await message.reply(predictionMessage)
                    if (predictionData[neutral_class] <= neutral_class_danger_probability) {
                        const fileName = `ds_pred_${v4()}`;
                        const fileDownloadName = `${fileName}.jpg`;
                        fs.writeFile(`./uploads/${fileDownloadName}`, base64, 'base64', async (err: any) => {
                            if (err) return;
                            await database("directus_files").insert({
                                storage: "local",
                                filename_disk: fileDownloadName,
                                filename_download: fileDownloadName,
                                title: fileDownloadName
                            })
                            await database("feedbacks").insert({
                                image: fileName,
                                image_url: url,
                                prediction_data: JSON.stringify(predictionData),
                            })
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            }


            client.on("ready", () => {
                const guild_ids = client.guilds.cache.map(guild => guild.id);
                const rest = new REST({ version: '9' }).setToken(bot_token);
                for (const guildId of guild_ids) {
                    rest.put(Routes.applicationGuildCommands(app_id, guildId),
                        { body: commands })
                        .then(() => console.log('Successfully updated commands for guild ' + guildId))
                        .catch(console.log);
                }


                emitter.onAction("holypics_predict_url", async (meta) => {
                    const channel = await client.channels.fetch(test_channels[0]);
                    // const channel = client.channels.cache.get(test_channels[0]);
                    // @ts-ignore
                    channel.send({ content: meta.imageUrl })
                })
            })



            client.on('messageCreate', async (message) => {
                if (message.content != null && message.content != undefined && message.content != "" && message.content.startsWith("http") && isValidUrl(message.content)) await processUrl(message, message.content.replace(/ /g, ""))
                if (message.attachments.size == 0) return;

                message.attachments.forEach(async item => {
                    await processUrl(message, item.attachment as string);
                })
            });

            client.on("interactionCreate", async interaction => {

                if (!interaction.isCommand()) return;
                // @ts-ignore
                const command = client.commands.get(interaction.commandName);
                if (!command) return;

                try {
                    await command.execute(interaction);
                }
                catch (error) {
                    console.log(error);
                    // interaction.
                    await interaction.reply({ content: "There was an error executing this command" });
                }
            });

            client.login(bot_token);

        } catch (error: any) {
            console.log(error);
        }

    })
};




