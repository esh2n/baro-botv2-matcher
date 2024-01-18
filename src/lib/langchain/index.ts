import DiscordBotCallbackHandler from './handler'
import { createLLM } from './llm'
import { createPrompt } from './template'
import { createAgentExecutor } from './agent'
import { createCache, createMemory } from './history'
// import { createChain } from './chain'

export const exec = async (sessionId: string, input: string) => {
  console.log('exec')
  const handler = new DiscordBotCallbackHandler({ channel: sessionId })
  const cache = await createCache()
  const llm = await createLLM(sessionId, handler, cache)
  const prompt = createPrompt(sessionId)
  const memory = await createMemory(sessionId)
  // const chain = await createChain(llm, memory)
  const agentExecutor = await createAgentExecutor(
    sessionId,
    llm,
    prompt,
    memory
  )
  const res = await agentExecutor!.invoke({
    prompt,
    input,
  })
  // console.log(res)
  if (res.output == 'Agent stopped due to max iterations.') {
    const answer =
      res.intermediateSteps[res.intermediateSteps.length - 1].observation
    const res2 = await exec(
      sessionId,
      '次の文章を日本語にしてください。' + answer
    )
    return res2
  }
  return res.output
}

export const refresh = async (sessionId: string) => {
  const memory = await createMemory(sessionId)
  memory.clear()
}

// ;(async () => {
//   const result = await exec('sessionID', 'こんにちわ。私の名前はHoge太郎です。')
//   const result2 = await exec('sessionID', '私の名前は？')
//   console.log(result)
//   console.log(result2)
// })()
