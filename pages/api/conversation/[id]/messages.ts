import { createHandler } from "@api/handler";
import {
  deleteConversation,
  getConversationById,
  updateConversation,
} from "@lib/conversation/api/convoService";
import { getMessagesByConversationId } from "@lib/messages/api/messageService";

const handler = createHandler();

handler.get(async (req, res) => {
  try {
    res.sendSuccess(await getMessagesByConversationId(req.query.id as string));
  } catch (error) {
    res.sendError(error);
  }
});
export default handler;
