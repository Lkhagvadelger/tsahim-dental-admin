import { createHandler } from "@api/handler";
import {
  deleteConversation,
  getConversationById,
  updateConversation,
} from "@lib/conversation/api/convoService";

const handler = createHandler();

handler
  .get(async (req, res) => {
    try {
      res.sendSuccess(await getConversationById(req.query.id as string));
    } catch (error) {
      res.sendError(error);
    }
  })
  .put(async (req, res) => {
    try {
      res.sendSuccess(
        await updateConversation(
          req.query.id as string,
          req.body.name,
          req.body.prompt
        )
      );
    } catch (error) {
      res.sendError(error);
    }
  })
  .delete(async (req, res) => {
    try {
      res.sendSuccess(await deleteConversation(req.query.id as string));
    } catch (error) {
      res.sendError(error);
    }
  });
export default handler;
