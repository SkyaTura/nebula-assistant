import * as TelegrafFilters from 'telegraf/filters'
import { AppModule } from '../../types'

export const hassHandler: AppModule = (app) => {
  app.telegraf.on(TelegrafFilters.message('text'), async (ctx, next) => {
    if (!ctx.message?.text) return next()
    const result = await app.hass.connection.sendMessagePromise({
      type: 'conversation/process',
      language: 'pt-BR',
      text: ctx.message.text,
    }) as any
    const matchError = result?.response?.data?.code === 'no_intent_match'
    if (!matchError) return ctx.reply(result.response.speech.plain.speech, { reply_to_message_id: ctx.message.message_id })
    app.logger('telegraf').get('hass').debug('No intent found for message', { message: ctx.message.text, result })
    return next()
  })
}