import { Configuration, OpenAIApi } from 'openai'
import { performance } from 'perf_hooks'
import { AppModule } from '../types'

export interface OpenAIConfig {
  apiKey: string
  model: string
  temperature: number
}

export { ChatCompletionRequestMessage } from 'openai'


export const setupOpenAI: AppModule = async (ctx) => {
  const log = ctx.logger('openai')
  const config = ctx.config.load('openai', {
    apiKey: process.env.OPENAI_API_KEY ?? '',
    chatDefaults: Object.fromEntries(Object.entries({
      model: process.env.OPENAI_CHAT_MODEL,
      temperature: parseFloat(process.env.OPENAI_CHAT_TEMPERATURE as string),
      max_tokens: parseInt(process.env.OPENAI_CHAT_MAX_TOKENS as string, 10),
      top_p: parseFloat(process.env.OPENAI_CHAT_TOP_P as string),
      frequency_penalty: parseFloat(process.env.OPENAI_CHAT_FREQUENCY_PENALTY as string),
      presence_penalty: parseFloat(process.env.OPENAI_CHAT_PRESENCE_PENALTY as string),
    }).filter(([_key, value]) => value !== undefined && value !== null && (typeof value !== 'number' || !isNaN(value as number)))),
  })
  const api = new OpenAIApi(new Configuration({ apiKey: config.apiKey }))

  let gptRequestCount = 0

  ctx.inject('openai', {
    api,
    async chatGPT(messages, options) {
      const id = ++gptRequestCount
      const chatLog = log.get('chatgpt').get(`r${id}`)
      chatLog.debug('Starting request')
      const start = performance.now()
      try {
        const result = await api.createChatCompletion({
          model: 'gpt-3.5-turbo',
          temperature: 0.75,
          max_tokens: 300,
          top_p: 1,
          frequency_penalty: 0.5,
          presence_penalty: 0.25,
          ...config.chatDefaults,
          ...options,
          messages,
        })
        const duration = (performance.now() - start) / 1000
        chatLog.debug('Request complete (%f s)', duration.toFixed(2))
        return result.data
      } catch (e: any) {
        const duration = (performance.now() - start) / 1000
        chatLog.error('Request failed  (%f s): %s', duration.toFixed(2), e?.data?.body ?? e?.message)
      }
      return null
    }
  })
}
