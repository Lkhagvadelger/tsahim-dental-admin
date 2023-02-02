import { createHandler } from "@api/handler";
import { getBots, getBotsFilter } from "@lib/bot/api/service";

const handler = createHandler();

handler
  .post(async (req, res) => {
    try {
      res.sendSuccess(await getBotsFilter(req.body));
    } catch (error) {
      res.sendError(error);
    }
  })
  .get(async (req, res) => {
    try {
      res.sendSuccess(await getBots());
    } catch (error) {
      res.sendError(error);
    }
  });

export default handler;
