import { ApiExtensionContext, SchemaOverview, Accountability } from "@directus/shared/types";
import { RegisterFunctions } from "../../@types/directus";
import { ItemsService } from 'directus';
import { getAdminTokens } from "../../helpers/auth";
import { Client, Collection, Intents } from "discord.js"
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import ping from "./commands/ping";

export default function ({ action }: RegisterFunctions, { database }: ApiExtensionContext) {

    type DiscordSetting = {
        app_id: string,
        public_key: string,
        bot_username: string,
        bot_token: string
    }

    action('server.start', async () => {
        try {

            let [{ discord_settings }] = await database("configurations").select("discord_settings")
            const { app_id, bot_token } = JSON.parse(discord_settings) as DiscordSetting;
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

            const commandsMap = {
                ping
            }

            for (const command of Object.keys(commandsMap)) {
                // @ts-ignore
                client.commands.set(commandsMap[command].data.name, commandsMap[command]);
                // @ts-ignore
                commands.push(commandsMap[command].data.toJSON());
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
            })

            client.on('message', async (message) => {
                console.log(message.content);
                console.log(message.attachments);
            });

            client.on("interactionCreate", async interaction => {
                console.log("interaction => ");
                console.log(interaction);

                if (!interaction.isCommand()) return;
                // @ts-ignore
                const command = client.commands.get(interaction.commandName);
                if (!command) return;

                try {
                    await command.execute(interaction);
                }
                catch (error) {
                    console.log(error);
                    await interaction.reply({ content: "There was an error executing this command" });
                }
            });

            client.login(bot_token);

        } catch (error) {
            console.log(error);
        }

    })
};




