import { ConversationChain } from 'langchain/chains'

export const createChain = async (sessionId, llm, memory) => {
  const instanceManager = ChainInstanceManager.getInstance()
  if (instanceManager.get(sessionId)) {
    return instanceManager.get(sessionId)
  }
  const chain = new ConversationChain({ llm, memory })
  instanceManager.set(sessionId, chain)
  return chain
}

// インスタンスを管理するクラス
class ChainInstanceManager {
  private static _instance: ChainInstanceManager | null = null
  private _instances: { [key: string]: ConversationChain } = {}

  public static getInstance(): ChainInstanceManager {
    if (!ChainInstanceManager._instance) {
      ChainInstanceManager._instance = new ChainInstanceManager()
    }
    return ChainInstanceManager._instance
  }

  public get(channelId: string): ConversationChain | null {
    return this._instances[channelId] || null
  }

  public set(channelId: string, instance: ConversationChain) {
    this._instances[channelId] = instance
  }
}
