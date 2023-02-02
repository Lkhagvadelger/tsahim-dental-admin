import { createHandler } from "@api/handler";
import { deleteBot, getBotById, updateBot } from "@lib/bot/api/service";

const handler = createHandler();

handler
  .get(async (req, res) => {
    try {
      res.sendSuccess(await getBotById(req.query.id as string));
    } catch (error) {
      res.sendError(error);
    }
  })
  .put(async (req, res) => {
    try {
      res.sendSuccess(
        await updateBot(
          req.body.id,
          req.body.name,
          req.body.initialPrompt,
          req.body.summarizePrompt,
          req.body.finisherPrompt,
          req.body.temperature,
          req.body.max_tokens,
          req.body.top_p,
          req.body.frequency_penalty,
          req.body.presence_penalty,
          req.body.best_of
        )
      );
    } catch (error) {
      res.sendError(error);
    }
  })
  .delete(async (req, res) => {
    try {
      res.sendSuccess(await deleteBot(req.body.id));
    } catch (error) {
      res.sendError(error);
    }
  });
export default handler;
