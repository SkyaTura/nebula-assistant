// @ts-ignore
import LogNode from 'log-node'
import Log from 'log'
import { Chalk } from 'chalk'
import { AppModule } from '../types'
import { Logger } from './types'


export const setupLogger: AppModule = async (ctx) => {
  LogNode()
  const log = Log.get.bind(Log)
  const chalk = new Chalk()
  const logger: Logger = Object.assign(log, { chalk })
  log('logger').notice('Logger setup complete!')
  ctx.inject('logger', logger)
}