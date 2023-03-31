import {
  Connection,
  getServices,
  getStates,
  getConfig,
  getUser,
  callService,
  subscribeEntities,
  subscribeServices,
} from "home-assistant-js-websocket";

export const setupHelpers = (connection: Connection) => ({
  getServices: getServices.bind(null, connection),
  getStates: getStates.bind(null, connection),
  getConfig: getConfig.bind(null, connection),
  getUser: getUser.bind(null, connection),
  callService: callService.bind(null, connection),
  subscribeEntities: subscribeEntities.bind(null, connection),
  subscribeServices: subscribeServices.bind(null, connection),
})