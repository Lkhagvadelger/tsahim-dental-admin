import { createHandler } from "@api/handler";
import {
  createConversationV2,
  getConversationById
} from "@lib/conversation/api/convoService";

const handler = createHandler();

handler
  .get(async (req, res) => {
    try {
      if (req.query.id)
        res.sendSuccess(await getConversationById(req.query.id as string));
      else res.sendError(400, "Missing id");
    } catch (error) {
      res.sendError(error);
    }
  })
  .post(async (req, res) => {
    try {
      res.sendSuccess(
        await createConversationV2(req.body.userId, req.body.profile, req.body.botId)
      );
    } catch (error) {
      res.sendError(error);
    }
  });

export default handler;
