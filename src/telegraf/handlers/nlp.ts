import * as TelegrafFilters from 'telegraf/filters'
import { AppModule, BotMessageContext } from '../../types'
import { NLP } from '../../nlp/types'

const intents: Record<string, (ctx: BotMessageContext, nlpResult: Awaited<ReturnType<NLP['process']>>, next: () => void) => any | Promise<any>> = {}

export const nlpHandler: AppModule = (app) => {
  app.telegraf.on(TelegrafFilters.message('text'), async (ctx, next) => {
    if (!ctx.message?.text) return next()
    const result = await app.nlp.process(ctx.message.text)

    if (result?.intent in intents) return intents[result.intent](ctx, result, next)

    app.logger('telegraf').get('nlp').debug('No intent found for message', { message: ctx.message.text, result })
    return next()
  })
}