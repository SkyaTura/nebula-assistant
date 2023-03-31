import {
  createConnection,
  createLongLivedTokenAuth,
} from "home-assistant-js-websocket";
import { AppModule } from "../types";
import { setupHelpers } from "./helpers";
import WebSocket from 'ws'

export const setupHass: AppModule = async (ctx) => {
  const log = ctx.logger('hass')
  const config = ctx.config.load('hass', {
    host: process.env.HASS_HOST ?? '',
    token: process.env.HASS_TOKEN ?? '',
  })
  globalThis.WebSocket = WebSocket as unknown as typeof globalThis['WebSocket']
  const auth = createLongLivedTokenAuth(
    config.host,
    config.token,
  )
  const connection = await createConnection({ auth });
  const hass = ctx.inject('hass', {
    connection,
    ...setupHelpers(connection)
  })
  log.notice('Hass setup complete!')
}