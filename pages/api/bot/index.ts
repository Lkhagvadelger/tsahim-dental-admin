import { createHandler } from "@api/handler";
import {
  createBot,
  deleteBot,
  getBots,
  updateBot,
} from "@lib/bot/api/service";

const handler = createHandler();

handler
  .get(async (req, res) => {
    try {
      if (req.query.id)
        res.sendSuccess(await getBots());
      else res.sendError(400, "Missing id");
    } catch (error) {
      res.sendError(error);
    }
  })
  .post(async (req, res) => {
    try {
      res.sendSuccess(
        await createBot(
          req.body.name,
          req.body.initialPrompt,
          req.body.summarizePrompt,
          req.body.finisherPrompt,
          req.body.temperature,
          req.body.max_tokens,
          req.body.top_p,
          req.body.frequency_penalty,
          req.body.presence_penalty,
          req.body.best_of,
        )
      );
    } catch (error) {
      res.sendError(error);
    }
  });

export default handler;
