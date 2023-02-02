import { createHandler } from "@api/handler";
import {
  getMessageByIdByConversationIdByUserId
} from "@lib/messages/api/messageService";

const handler = createHandler();

handler.get(async (req, res) => {
  try {
    if (req.query.conversationId && req.query.id && req.query.messageId)
      res.sendSuccess(
        await getMessageByIdByConversationIdByUserId(
          req.query.messageId as string,
          req.query.conversationId as string,
          req.query.id as string
        )
      );
    else res.sendSuccess([]);
  } catch (error) {
    res.sendError(error);
  }
});
export default handler;
