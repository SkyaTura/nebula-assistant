import { Telegraf } from "telegraf";
import * as TelegrafFilters from 'telegraf/filters'
import { AppModule, BotContext } from "../types";
import { setupHandlers } from "./handlers";

export const setupTelegraf: AppModule = async (app) => {
  const log = app.logger('telegraf')
  const config = app.config.load('telegraf', {
    telegram: {
      botToken: process.env.TELEGRAM_BOT_TOKEN ?? '',
    }
  })
  const telegraf = new Telegraf<BotContext>(config.telegram.botToken);

  app.inject("telegraf", telegraf);
  telegraf.use((ctx, next) => {
    ctx.app = app
    return next()
  })

  await setupHandlers(app)
  telegraf.launch()

  log.notice('Telegraf setup complete!')
}