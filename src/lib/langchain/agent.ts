import {
  AgentExecutor,
  initializeAgentExecutorWithOptions,
} from 'langchain/agents'
import { SerpAPI } from '@langchain/community/tools/serpapi'
import { Calculator } from 'langchain/tools/calculator'
import 'dotenv/config'
import { MessagesPlaceholder } from '@langchain/core/prompts'
import { prefix, suffix } from './template'

export const createAgentExecutor = async (sessionId, llm, _, memory) => {
  const instanceManager = AgentExecutorInstanceManager.getInstance()
  if (instanceManager.get(sessionId)) {
    return instanceManager.get(sessionId)
  }
  const tools = [
    new SerpAPI(process.env['SERPAPI_API_KEY'], {
      location: 'Japan',
      hl: 'en',
      gl: 'us',
    }),
    new Calculator(),
  ]

  // const agent = await createOpenAIToolsAgent({ llm, tools, prompt })
  // const agent = await createOpenAIFunctionsAgent({ llm, tools, prompt })
  // const agentexecutor = new AgentExecutor({
  //   agent,
  //   tools,
  //   memory,
  //   maxIterations: 2,
  //   returnIntermediateSteps: true,
  // })
  const agentexecutor = await initializeAgentExecutorWithOptions(tools, llm, {
    agentType: 'structured-chat-zero-shot-react-description',
    memory: memory,
    agentArgs: {
      inputVariables: ['input', 'agent_scratchpad', 'chat_history'],
      memoryPrompts: [new MessagesPlaceholder('chat_history')],
      prefix: prefix,
      suffix: suffix,
    },
  })
  instanceManager.set(sessionId, agentexecutor)
  return agentexecutor
}

// インスタンスを管理するクラス
class AgentExecutorInstanceManager {
  private static _instance: AgentExecutorInstanceManager | null = null
  private _instances: { [key: string]: AgentExecutor } = {}

  public static getInstance(): AgentExecutorInstanceManager {
    if (!AgentExecutorInstanceManager._instance) {
      AgentExecutorInstanceManager._instance =
        new AgentExecutorInstanceManager()
    }
    return AgentExecutorInstanceManager._instance
  }

  public get(channelId: string): AgentExecutor | null {
    return this._instances[channelId] || null
  }

  public set(channelId: string, instance: AgentExecutor) {
    this._instances[channelId] = instance
  }
}
