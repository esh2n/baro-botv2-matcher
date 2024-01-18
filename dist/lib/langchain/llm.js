"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLLM = void 0;
const openai_1 = require("@langchain/openai");
const createLLM = async (sessionId, handler, cache) => {
    const instanceManager = LLMInstanceManager.getInstance();
    if (instanceManager.get(sessionId)) {
        return instanceManager.get(sessionId);
    }
    const llm = new openai_1.ChatOpenAI({
        modelName: 'gpt-4',
        temperature: 0.4,
        streaming: true,
        callbacks: [handler],
        cache,
    });
    instanceManager.set(sessionId, llm);
    return llm;
};
exports.createLLM = createLLM;
class LLMInstanceManager {
    static _instance = null;
    _instances = {};
    static getInstance() {
        if (!LLMInstanceManager._instance) {
            LLMInstanceManager._instance = new LLMInstanceManager();
        }
        return LLMInstanceManager._instance;
    }
    get(channelId) {
        return this._instances[channelId] || null;
    }
    set(channelId, instance) {
        this._instances[channelId] = instance;
    }
}
