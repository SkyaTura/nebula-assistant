import { AppModule } from "../types";
import { ConversationalProcess, ConversationalRequest, ConversationalResponse } from "./types";

export interface ConversationalHandler {
  (input: ConversationalRequest): Promise<ConversationalResponse | null | symbol>
}

export const setupConversational: AppModule = async (ctx) => {
  const logger = ctx.logger('conversational')
  const skipped = Symbol('skipped')
  const handlers: ConversationalHandler[] = [
    async function hass(input) {
      if (!ctx.hass) return skipped
      const result = await ctx.hass.connection.sendMessagePromise({
        type: 'conversation/process',
        language: 'pt-BR',
        text: input.text,
      }) as any
      const matchError = result?.response?.data?.code === 'no_intent_match'
      if (matchError) return null
      return { text: result.response.speech.plain.speech }
    },
    async function nlp(input) {
      if (!ctx.nlp) return skipped
      const result = await ctx.nlp.process(input.text)
      if (!result?.intent || result.intent === 'None') return null
      return { text: result.intent }
    },
    async function openai(input) {
      if (!ctx.openai) return skipped
      const result = await ctx.openai.chatGPT([{ role: 'user', content: input.text }])
      const answer = result?.choices?.[0]?.message?.content
      if (!answer) return null
      return { text: answer }
    },
  ]
  ctx.inject('conversational', {
    async process(input) {
      if (!input.text) {
        logger.debug('No text to process')
        return null
      }
      for (const handler of handlers) {
        const log = logger.get(handler.name)
        log.debug('Processing input')
        const response = await handler(input)
        const hasResponse = !!response && response !== skipped
        if (response === skipped) log.debug('Handler skipped')
        else log.debug('Has response? %j', hasResponse)
        if (hasResponse) return response as ConversationalResponse
      }
      logger.debug('No response found')
      return null
    }
  })
  logger.notice('Conversational setup complete!')
}