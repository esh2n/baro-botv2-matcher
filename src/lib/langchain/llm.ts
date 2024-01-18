import { ChatOpenAI } from '@langchain/openai'
import DiscordBotCallbackHandler from './handler'

export const createLLM = async (
  sessionId: string,
  handler: DiscordBotCallbackHandler,
  cache
) => {
  const instanceManager = LLMInstanceManager.getInstance()
  if (instanceManager.get(sessionId)) {
    return instanceManager.get(sessionId)
  }
  const llm = new ChatOpenAI({
    modelName: 'gpt-4',
    temperature: 0.4,
    streaming: true,
    callbacks: [handler],
    cache,
  })
  instanceManager.set(sessionId, llm)
  return llm
}

// インスタンスを管理するクラス
class LLMInstanceManager {
  private static _instance: LLMInstanceManager | null = null
  private _instances: { [key: string]: ChatOpenAI } = {}

  public static getInstance(): LLMInstanceManager {
    if (!LLMInstanceManager._instance) {
      LLMInstanceManager._instance = new LLMInstanceManager()
    }
    return LLMInstanceManager._instance
  }

  public get(channelId: string): ChatOpenAI | null {
    return this._instances[channelId] || null
  }

  public set(channelId: string, instance: ChatOpenAI) {
    this._instances[channelId] = instance
  }
}
