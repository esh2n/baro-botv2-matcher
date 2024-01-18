"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("@langchain/core/callbacks/base");
class DiscordBotCallbackHandler extends base_1.BaseCallbackHandler {
    name = 'DiscordBotCallbackHandler';
    channel;
    message = '';
    lastTime = 0;
    constructor({ channel }) {
        super();
        this.channel = channel;
        console.log(this.channel);
    }
    handleLLMNewToken(token) {
        this.message = this.message + token;
        const currentTime = new Date().getTime();
        if (currentTime - this.lastTime > 2000 && token) {
            this.lastTime = currentTime;
        }
    }
    handleLLMEnd() {
    }
}
exports.default = DiscordBotCallbackHandler;
