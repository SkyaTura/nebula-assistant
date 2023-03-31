import { AppModule } from "../../types";
import { conversationalHandler } from "./conversational";

export const setupHandlers: AppModule = async app => {
  await conversationalHandler(app)
}