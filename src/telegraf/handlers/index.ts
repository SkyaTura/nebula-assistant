import { AppModule } from "../../types";
import { openaiHandler } from "./openai";
import { hassHandler } from "./hass";
import { nlpHandler } from "./nlp";

export const setupHandlers: AppModule = async app => {
  await hassHandler(app)
  await nlpHandler(app)
  await openaiHandler(app)
}