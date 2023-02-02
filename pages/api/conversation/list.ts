import { createHandler } from "@api/handler";
import {
  getConversations,
  getConversationsFilter,
} from "@lib/conversation/api/convoService";

const handler = createHandler();

handler
  .post(async (req, res) => {
    try {
      res.sendSuccess(await getConversationsFilter(req.body));
    } catch (error) {
      res.sendError(error);
    }
  })
  .get(async (req, res) => {
    try {
      res.sendSuccess(await getConversations());
    } catch (error) {
      res.sendError(error);
    }
  });

export default handler;
