import * as TelegrafFilters from 'telegraf/filters'
import { AppModule } from '../../types'

export const openaiHandler: AppModule = (app) => {
  app.telegraf.on(TelegrafFilters.message('text'), async (ctx, next) => {
    if (!ctx.message?.text) return next()
    const result = await app.openai.chatGPT([{ role: 'user', content: ctx.message.text }])

    const answer = result?.choices?.[0]?.message?.content
    if (answer) return ctx.reply(answer, { reply_to_message_id: ctx.message.message_id })

    app.logger('telegraf').get('openai').debug('No intent found for message', { message: ctx.message.text, result })
    return next()
  })
}