"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskCommand = void 0;
const langchain_1 = require("../../lib/langchain");
const command_1 = require("../command");
class AskCommand extends command_1.CommandBase {
    static _instance = null;
    constructor() {
        super('ask', 'ばろ犬に質問をします');
    }
    static getInstance() {
        if (!AskCommand._instance) {
            AskCommand._instance = new AskCommand();
        }
        return AskCommand._instance;
    }
    defineOptions() {
        return [
            {
                name: 'question',
                type: 3,
                description: '質問文',
                required: true,
            },
            {
                name: 'is_memory_refresh',
                type: 5,
                description: '記憶をリセットするか',
                required: false,
                default: false,
            },
        ];
    }
    async handle(i) {
        const inputMessage = i.options.getString('question');
        await i.deferReply();
        const channelId = i.channelId;
        const result = await (0, langchain_1.exec)(channelId, inputMessage);
        await i.editReply({
            content: `
## 質問
${inputMessage}`,
            embeds: [
                {
                    title: '回答',
                    color: 0x00ff00,
                    description: result,
                },
            ],
        });
        const isMemoryRefresh = i.options.getBoolean('is_memory_refresh');
        if (isMemoryRefresh) {
            await (0, langchain_1.refresh)(channelId);
        }
    }
}
exports.AskCommand = AskCommand;
exports.default = AskCommand.getInstance();
