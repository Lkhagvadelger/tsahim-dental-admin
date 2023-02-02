import { createHandler } from "@api/handler";
import {
  deleteConversation,
  getConversationById,
  getConversationSummary,
  updateConversation,
} from "@lib/conversation/api/convoService";

const handler = createHandler();

handler.post(async (req, res) => {
  try {
    res.sendSuccess(await getConversationSummary(req.body.conversationId as string));
  } catch (error) {
    res.sendError(error);
  }
});
export default handler;
