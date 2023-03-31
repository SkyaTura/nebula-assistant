import * as Logger from './logger/types'
import * as Hass from './hass/types'
import * as Conversational from './conversational/types'
import * as OpenAI from './openai/types'
import * as Telegraf from './telegraf/types'
import { NLP } from './nlp/types'

export * from './hass/types'
export * from './telegraf/types'
export * from './logger/types'

export interface Config {
  hass: Hass.HassConfig
  telegraf: Telegraf.TelegrafConfig
  load: <Key extends keyof Omit<Config, 'inject'>>(key: Key, value: Config[Key]) => Config[Key]
  openai: OpenAI.OpenAIConfig
}

export interface AppContext {
  config: Config
  hass: Hass.HassModule
  telegraf: Telegraf.Telegraf<BotContext>
  inject: <Key extends keyof Omit<AppContext, 'inject'>>(key: Key, value: AppContext[Key]) => AppContext[Key]
  logger: Logger.Logger
  nlp: NLP
  openai: OpenAI.OpenAIModule
  conversational: Conversational.ConversationalModule
}

export interface BotContext extends Telegraf.Context {
  app: AppContext
}

export type BotMessageContext = Telegraf.TelegrafMessageContext<BotContext>

export type AppModule = (ctx: AppContext) => any | Promise<any>