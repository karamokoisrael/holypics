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
Object.defineProperty(exports, "__esModule", { value: true });
const imageToBase64 = require('image-to-base64');
const builders_1 = require("@discordjs/builders");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName("upload")
        .setDescription("Upload a file using url")
        .addStringOption(option => option.setName('url')
        .setDescription('Enter the file url')
        .setRequired(true)),
    execute(interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const url = (_a = interaction.options.get("url")) === null || _a === void 0 ? void 0 : _a.value;
            try {
                yield interaction.reply({
                    files: [{
                            attachment: url.replace(/ /g, "")
                        }]
                });
            }
            catch (error) {
                // console.log(error);
            }
        });
    }
};
