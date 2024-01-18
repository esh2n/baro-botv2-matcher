"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAgentExecutor = void 0;
const agents_1 = require("langchain/agents");
const serpapi_1 = require("@langchain/community/tools/serpapi");
const calculator_1 = require("langchain/tools/calculator");
require("dotenv/config");
const prompts_1 = require("@langchain/core/prompts");
const template_1 = require("./template");
const createAgentExecutor = async (sessionId, llm, _, memory) => {
    const instanceManager = AgentExecutorInstanceManager.getInstance();
    if (instanceManager.get(sessionId)) {
        return instanceManager.get(sessionId);
    }
    const tools = [
        new serpapi_1.SerpAPI(process.env.SERPAPI_API_KEY, {
            location: 'Japan',
            hl: 'en',
            gl: 'us',
        }),
        new calculator_1.Calculator(),
    ];
    const agentexecutor = await (0, agents_1.initializeAgentExecutorWithOptions)(tools, llm, {
        agentType: 'structured-chat-zero-shot-react-description',
        memory: memory,
        agentArgs: {
            inputVariables: ['input', 'agent_scratchpad', 'chat_history'],
            memoryPrompts: [new prompts_1.MessagesPlaceholder('chat_history')],
            prefix: template_1.prefix,
            suffix: template_1.suffix,
        },
    });
    instanceManager.set(sessionId, agentexecutor);
    return agentexecutor;
};
exports.createAgentExecutor = createAgentExecutor;
class AgentExecutorInstanceManager {
    static _instance = null;
    _instances = {};
    static getInstance() {
        if (!AgentExecutorInstanceManager._instance) {
            AgentExecutorInstanceManager._instance =
                new AgentExecutorInstanceManager();
        }
        return AgentExecutorInstanceManager._instance;
    }
    get(channelId) {
        return this._instances[channelId] || null;
    }
    set(channelId, instance) {
        this._instances[channelId] = instance;
    }
}
