"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const node_cron_1 = __importDefault(require("node-cron"));
const main_1 = require("./main");
const bo_1 = require("./command/bo");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
        discord_js_1.GatewayIntentBits.GuildMessageReactions,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
});
client.on('ready', async () => {
    console.log('Bot is ready.');
    const textChannel = client.channels.cache.find((channel) => channel.isTextBased() &&
        channel.name === '募集' &&
        channel.id === '1006967319676846130');
    if (!textChannel) {
        console.log('募集チャンネルが見つかりませんでした');
        return;
    }
    if (textChannel) {
        node_cron_1.default.schedule('0 9 * * 1-5', () => {
            bo_1.BoCommand.send(textChannel, client);
        }, {
            scheduled: true,
            timezone: 'Asia/Tokyo',
        });
        node_cron_1.default.schedule('0 10 * * 0,6', () => {
            bo_1.BoCommand.send(textChannel, client);
        }, {
            scheduled: true,
            timezone: 'Asia/Tokyo',
        });
    }
});
client.on('interactionCreate', async (interaction) => {
    await (0, main_1.handleCommands)(interaction, client);
});
client.on('messageCreate', async (message) => {
    if (message.author.bot) {
        return;
    }
});
client.on('voiceStateUpdate', (_, newState) => {
    if (newState.member?.user.bot) {
        return;
    }
});
client.login('MTE5NTk1NDQwNDQ5OTY1NjcyNw.GwNUsD.gzNO1A8gWeQH_y3gij-CQMHdVaCBQyP-SzOvuM' ||
    '');
