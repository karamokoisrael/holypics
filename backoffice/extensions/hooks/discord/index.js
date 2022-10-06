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
function default_1({ action }, { database }) {
    action('server.start', () => __awaiter(this, void 0, void 0, function* () {
        try {
            let [{ discord_settings }] = yield database("configurations").select("discord_settings");
            const { app_id, bot_token } = JSON.parse(discord_settings);
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
            const commandsMap = {
                ping: ping_1.default
            };
            for (const command of Object.keys(commandsMap)) {
                // @ts-ignore
                client.commands.set(commandsMap[command].data.name, commandsMap[command]);
                // @ts-ignore
                commands.push(commandsMap[command].data.toJSON());
            }
            client.on("ready", () => {
                const guild_ids = client.guilds.cache.map(guild => guild.id);
                const rest = new rest_1.REST({ version: '9' }).setToken(bot_token);
                for (const guildId of guild_ids) {
                    rest.put(v9_1.Routes.applicationGuildCommands(app_id, guildId), { body: commands })
                        .then(() => console.log('Successfully updated commands for guild ' + guildId))
                        .catch(console.log);
                }
            });
            client.on('message', (message) => __awaiter(this, void 0, void 0, function* () {
                console.log(message.content);
                console.log(message.attachments);
            }));
            client.on("interactionCreate", (interaction) => __awaiter(this, void 0, void 0, function* () {
                console.log("interaction => ");
                console.log(interaction);
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
                    yield interaction.reply({ content: "There was an error executing this command" });
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
