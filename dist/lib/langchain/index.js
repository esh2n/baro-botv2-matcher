"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.exec = void 0;
const handler_1 = __importDefault(require("./handler"));
const llm_1 = require("./llm");
const template_1 = require("./template");
const agent_1 = require("./agent");
const history_1 = require("./history");
const exec = async (sessionId, input) => {
    console.log('exec');
    const handler = new handler_1.default({ channel: sessionId });
    const cache = await (0, history_1.createCache)();
    const llm = await (0, llm_1.createLLM)(sessionId, handler, cache);
    const prompt = (0, template_1.createPrompt)(sessionId);
    const memory = await (0, history_1.createMemory)(sessionId);
    const agentExecutor = await (0, agent_1.createAgentExecutor)(sessionId, llm, prompt, memory);
    const res = await agentExecutor.invoke({
        prompt,
        input,
    });
    if (res.output == 'Agent stopped due to max iterations.') {
        const answer = res.intermediateSteps[res.intermediateSteps.length - 1].observation;
        const res2 = await (0, exports.exec)(sessionId, '次の文章を日本語にしてください。' + answer);
        return res2;
    }
    return res.output;
};
exports.exec = exec;
const refresh = async (sessionId) => {
    const memory = await (0, history_1.createMemory)(sessionId);
    memory.clear();
};
exports.refresh = refresh;
