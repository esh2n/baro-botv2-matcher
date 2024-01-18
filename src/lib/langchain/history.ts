import { MomentoChatMessageHistory } from '@langchain/community/stores/message/momento'
import { CacheClient, Configurations, CredentialProvider } from '@gomomento/sdk'
import { BufferMemory } from 'langchain/memory'
import { MomentoCache } from '@langchain/community/caches/momento'
import 'dotenv/config'

const cacheClient = new CacheClient({
  configuration: Configurations.Laptop.v1(),
  credentialProvider: CredentialProvider.fromString({
    apiKey: process.env['MOMENTO_AUTH_TOKEN'] as string,
  }),
  defaultTtlSeconds: 60 * 60 * 24,
})

export const createMemory = async (sessionId: string) => {
  const memory = new BufferMemory({
    chatHistory: await MomentoChatMessageHistory.fromProps({
      client: cacheClient,
      cacheName: process.env['MOMENTO_CACHE'] as string,
      sessionId,
      sessionTtl: 60 * 60 * 24,
    }),
    memoryKey: 'chat_history',
    inputKey: 'input',
    outputKey: 'output',
    returnMessages: true,
  })
  return memory
}

export const createCache = async () => {
  return await MomentoCache.fromProps({
    client: cacheClient,
    cacheName: process.env['MOMENTO_CACHE'] as string,
  })
}
