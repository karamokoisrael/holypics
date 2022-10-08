const imageToBase64 = require('image-to-base64');
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("upload")
        .setDescription("Upload a file using url")
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Enter the file url')
                .setRequired(true)),
    async execute(interaction: CommandInteraction) {
        const url = interaction.options.get("url")?.value as string;
        try {
            await interaction.reply({
                files: [{
                    attachment: url.replace(/ /g, "")
                }]
            })
        } catch (error: any) {
            // console.log(error);
        }
    }
}