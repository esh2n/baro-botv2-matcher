"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCache = exports.createMemory = void 0;
const momento_1 = require("@langchain/community/stores/message/momento");
const sdk_1 = require("@gomomento/sdk");
const memory_1 = require("langchain/memory");
const momento_2 = require("@langchain/community/caches/momento");
require("dotenv/config");
const cacheClient = new sdk_1.CacheClient({
    configuration: sdk_1.Configurations.Laptop.v1(),
    credentialProvider: sdk_1.CredentialProvider.fromString({
        apiKey: process.env.MOMENTO_AUTH_TOKEN,
    }),
    defaultTtlSeconds: 60 * 60 * 24,
});
const createMemory = async (sessionId) => {
    const memory = new memory_1.BufferMemory({
        chatHistory: await momento_1.MomentoChatMessageHistory.fromProps({
            client: cacheClient,
            cacheName: process.env.MOMENTO_CACHE,
            sessionId,
            sessionTtl: 60 * 60 * 24,
        }),
        memoryKey: 'chat_history',
        inputKey: 'input',
        outputKey: 'output',
        returnMessages: true,
    });
    return memory;
};
exports.createMemory = createMemory;
const createCache = async () => {
    return await momento_2.MomentoCache.fromProps({
        client: cacheClient,
        cacheName: process.env.MOMENTO_CACHE,
    });
};
exports.createCache = createCache;
