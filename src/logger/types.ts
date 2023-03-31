import Log from 'log'
import chalk from 'chalk'

export type Logger = typeof Log.get & {
  chalk: typeof chalk
}