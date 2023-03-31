import { AppModule, Config } from '../types'

export const setupConfig: AppModule = ((ctx) => {
  const log = ctx.logger('config')
  const config = {
    load(key, value) {
      config[key] = value
      return value
    }
  } as Config
  ctx.inject('config', config)
  log.notice('Config setup complete!')
})