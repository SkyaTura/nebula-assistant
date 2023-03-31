import * as TelegrafFilters from 'telegraf/filters'
import { AppModule } from '../../types'

export const conversationalHandler: AppModule = (app) => {
  app.telegraf.command('chat', async (ctx, next) => {
    const text = ctx.message?.text?.trim()
    if (!text) return next()

    const match = text.matchAll(/^\/chat\s+(\w+)\s((.|\s)*$)/g)
    const [_command, engine, textToProcess] = match.next().value ?? []
    const result = await app.conversational.process({ text: textToProcess }, [engine])
    const invalidEngine = !['hass', 'nlp', 'openai'].includes(engine)
    const response = invalidEngine ? `Invalid engine: ${engine}` : (result?.text ?? 'No response')
    return ctx.reply(response, { reply_to_message_id: ctx.message.message_id })

  })
  app.telegraf.on(TelegrafFilters.message('text'), async (ctx, next) => {
    if (!ctx.message?.text) return next()
    const { text } = ctx.message
    const result = await app.conversational.process({ text })

    if (result?.text) return ctx.reply(result.text, { reply_to_message_id: ctx.message.message_id })

    app.logger('telegraf').get('nlp').debug('No intent found for message', { message: ctx.message.text, result })
    return next()
  })
}