"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCommands = void 0;
const http_1 = __importDefault(require("http"));
const url_1 = __importDefault(require("url"));
const help_1 = __importDefault(require("./command/help"));
const bo_1 = __importDefault(require("./command/bo"));
const ask_1 = __importDefault(require("./command/ask"));
const discord_js_1 = require("discord.js");
require("dotenv/config");
http_1.default
    .createServer(function (request, response) {
    const hostname = request.headers.host;
    const pathname = url_1.default.parse(request.url).pathname;
    console.log(`Request for ${hostname} ${pathname} received.`);
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end(`url: http://${hostname + pathname} \n`);
})
    .listen(process.env['PORT']);
const getCommands = () => {
    return [
        help_1.default.getCommand(),
        bo_1.default.getCommand(),
        ask_1.default.getCommand(),
    ];
};
const handleCommands = async (i, c) => {
    if (!i.isCommand())
        return;
    const command = i.commandName;
    switch (command) {
        case 'help':
            await help_1.default.handle();
            break;
        case 'bo':
            await bo_1.default.handle(i, c);
            break;
        case 'ask':
            await ask_1.default.handle(i);
            break;
        default:
            console.log('unknown command');
            break;
    }
};
exports.handleCommands = handleCommands;
const waitSeconds = (second) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000 * second);
    });
};
const main = async () => {
    const rest = new discord_js_1.REST({ version: '10' }).setToken(process.env['DISCORD_BOT_TOKEN'] || '');
    try {
        const commands = getCommands();
        await waitSeconds(5);
        console.log('Started refreshing application (/) commands.');
        if (process.env['GUILD_ID']) {
            await rest.put(discord_js_1.Routes.applicationGuildCommands(process.env['CLIENT_ID'] || '', process.env['GUILD_ID']), {
                body: commands,
            });
        }
        else {
            await rest.put(discord_js_1.Routes.applicationCommands(process.env['CLIENT_ID'] || ''), {
                body: commands,
            });
        }
    }
    catch (error) {
        console.error('Error while reloading application (/) commands: ', error);
        console.table(error);
        console.error(error);
    }
};
require("./client");
main();
