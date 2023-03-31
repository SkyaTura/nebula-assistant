import { NarrowedContext, Context } from 'telegraf';
import { Update, Message } from 'telegraf/typings/core/types/typegram';
import * as TelegrafFilters from 'telegraf/filters'

export { Telegraf, Context } from 'telegraf'

export interface TelegrafConfig {
  telegram: {
    botToken: string;
  }
}

export type TelegrafMessageContext<T extends Context> = NarrowedContext<T, Update.MessageUpdate<Record<"text", {}> & Message.TextMessage>>

export { TelegrafFilters }