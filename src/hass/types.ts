import { Connection } from "home-assistant-js-websocket";
import { setupHelpers } from "./helpers";

export interface HassConfig {
  token: string;
  host: string;
}

export interface HassModule extends ReturnType<typeof setupHelpers> {
  connection: Connection
}