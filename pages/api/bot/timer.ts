import { createHandler } from "@api/handler";
import { timerBasedLogic } from "@lib/bot/api/botService";

const handler = createHandler();

handler.get(async (req, res) => {
  try {
    res.sendSuccess(await timerBasedLogic());
  } catch (error) {
    res.sendError(error);
  }
});

export default handler;
