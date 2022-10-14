import { Accountability } from '@directus/shared/types';
import { SchemaOverview } from '@directus/shared/types';
import { ExtendedApiExtensionContext } from './../../@types/directus';
import { RegisterFunctions } from "../../@types/directus";
import { AnyChannel, Client, Collection, Intents, Message, MessageActionRow, MessageButton } from "discord.js"
import { REST } from "@discordjs/rest";
import { ButtonStyle, Routes } from "discord-api-types/v9";
import ping from "./commands/ping";
const imageToBase64 = require('image-to-base64');
import axios from 'axios';
import { FilesService } from 'directus';
import { getAdminTokens } from '../../helpers/auth';
import { v4 } from "uuid";
const fs = require("fs")
import Jimp from 'jimp';
import moment from 'moment';

export default function ({ action }: RegisterFunctions, { database, emitter }: ExtendedApiExtensionContext) {

    type DiscordSetting = {
        app_id: string,
        public_key: string,
        bot_username: string,
        bot_token: string,
        nfsw_model_path: string,
        neutral_class: string,
        neutral_class_danger_probability: number,
        test_channels: string[],
        prediction_folder: string,
        bot_custom_id: string,
        store_all_predictions: boolean
    }

    action('server.start', async (meta, { accountability, schema }) => {
        try {


            const { admin_id } = await getAdminTokens(database);
            // const filesService = new FilesService({ schema: schema as SchemaOverview, accountability: { ...(accountability as Accountability), user: admin_id as string, admin: true } })

            let [{ discord_settings }] = await database("configurations").select("discord_settings")
            const { bot_custom_id, store_all_predictions, app_id, bot_token, nfsw_model_path, neutral_class, neutral_class_danger_probability, test_channels, prediction_folder } = JSON.parse(discord_settings) as DiscordSetting;
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
                    const reqParams = new URLSearchParams();
                    reqParams.append("base64", base64)
                    const prediction = await axios.post(`${process.env.PUBLIC_URL as string}/holypics/predict`,
                        reqParams,
                        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
                    )

                    const predictionData = {} as Record<string, any>;
                    let predictionMessage = "";
                    const uuid = v4();
                    const actionRow = new MessageActionRow()

                    for (const key of Object.keys(prediction.data[0])) {
                        predictionData[key] = prediction.data[0][key];
                        predictionMessage += `${key}: ${(Math.round(prediction.data[0][key] * 100))}% \n`
                        actionRow.addComponents(
                            new MessageButton()
                                .setStyle("PRIMARY")
                                .setLabel(`${key}`)
                                .setCustomId(`${bot_custom_id}_class_${key}_id_${uuid}`));
                    }

                    const utilityRow = new MessageActionRow().addComponents(
                        new MessageButton()
                            .setStyle("LINK")
                            .setLabel("See image")
                            // .setCustomId(`${bot_custom_id}_download_image_btn`)
                            .setURL((store_all_predictions) ? `${process.env.PUBLIC_URL}/file/${uuid}` : url)
                            .setDisabled(false))


                    if (test_channels.includes(message.channel.id)) await message.reply({
                        content: predictionMessage, components: [actionRow, utilityRow]
                    })

                    if (store_all_predictions) {
                        const fileName = `${bot_custom_id}_pred_${uuid}`;
                        const fileDownloadName = `${fileName}.jpg`;

                        fs.writeFile(`./uploads/${fileDownloadName}`, base64, { encoding: 'base64' }, async (err: any) => {
                            if (err) return;

                            const buffer = Buffer.from(base64, 'base64');
                            const image = await Jimp.read(buffer);

                            await database("directus_files").insert({
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
                                uploaded_on: moment(new Date(), "DD-MM-YYYY hh:mm:ss").toDate()
                            })

                            await database("feedbacks").insert({
                                image: uuid,
                                image_url: url,
                                prediction_data: JSON.stringify(predictionData),
                                date_created: moment(new Date(), "DD-MM-YYYY hh:mm:ss").toDate(),
                                user_created: admin_id
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

                try {
                    if (interaction.isButton() && interaction.customId.startsWith(`${bot_custom_id}_class_`)) {
                        const idSubstring = interaction.customId.split(`${bot_custom_id}_class_`)[1];
                        const [className, imageId] = idSubstring.split("_id_")
                        await database("feedbacks").update({ moderation_classes: JSON.stringify([className]) }).where("image", "=", imageId);

                        const components = interaction.message.components;
                        if ((components?.length as number) <= 3) {
                            const row = new MessageActionRow().addComponents(
                                new MessageButton()
                                    .setStyle("SUCCESS")
                                    .setLabel("✔️")
                                    .setCustomId(`${bot_custom_id}${v4()}`)
                                    .setDisabled(true))
                            // @ts-ignore
                            components?.push(row)
                        }

                        return interaction.update({
                            content: interaction.message.content,
                            // @ts-ignore
                            components,
                        })
                    }

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
                } catch (error) {
                    // console.log(error);
                }
            });

            client.login(bot_token);

        } catch (error: any) {
            console.log(error);
        }

    })
};




