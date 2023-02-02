import { createHandler } from "@api/handler";
import { getMessagesByConversationId } from "@lib/messages/api/messageService";

const handler = createHandler();

handler.get(async (req, res) => {
  try {
    if (req.query.conversationId && req.query.id)
      res.sendSuccess(
        await getMessagesByConversationId(
          req.query.conversationId as string
        )
      );
    else res.sendSuccess([]);
  } catch (error) {
    res.sendError(error);
  }
});
export default handler;
