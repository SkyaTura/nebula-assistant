import dotenv from 'dotenv'
dotenv.config()

import { setupConfig } from "./config";
import { setupHass } from "./hass";
import { setupLogger } from "./logger";
import { AppContext, AppModule } from "./types";
import { setupTelegraf } from './telegraf';
import { setupNLP } from './nlp';
import { setupOpenAI } from './openai';

export const setup = async (modules: AppModule[]) => {
  const ctx = {
    inject(key, value) {
      ctx[key] = value
      return value
    }
  } as AppContext
  for (const setupModule of modules) {
    await setupModule(ctx)
  }
  return ctx
}

export const main = async () => setup([
  setupLogger,
  setupConfig,
  setupHass,
  setupNLP,
  setupOpenAI,
  setupTelegraf,
])

main()
  .then(({ logger }) => logger('main').notice(logger.chalk.green('Setup complete!')))
  .catch(err => console.error(err))