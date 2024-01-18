"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChain = void 0;
const chains_1 = require("langchain/chains");
const createChain = async (sessionId, llm, memory) => {
    const instanceManager = ChainInstanceManager.getInstance();
    if (instanceManager.get(sessionId)) {
        return instanceManager.get(sessionId);
    }
    const chain = new chains_1.ConversationChain({ llm, memory });
    instanceManager.set(sessionId, chain);
    return chain;
};
exports.createChain = createChain;
class ChainInstanceManager {
    static _instance = null;
    _instances = {};
    static getInstance() {
        if (!ChainInstanceManager._instance) {
            ChainInstanceManager._instance = new ChainInstanceManager();
        }
        return ChainInstanceManager._instance;
    }
    get(channelId) {
        return this._instances[channelId] || null;
    }
    set(channelId, instance) {
        this._instances[channelId] = instance;
    }
}
