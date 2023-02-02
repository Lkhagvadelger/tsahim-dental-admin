import { createHandler } from "@api/handler";
import {
  userSMSReplyOfWebService
} from "@lib/messages/api/messageService";

const handler = createHandler();

handler.put(async (req, res) => {
  try {
    res.sendSuccess(
      await userSMSReplyOfWebService(
        req.body.conversationId as string,
        req.body.input as string
      )
    );
  } catch (error) {
    res.sendError(error);
  }
});

export default handler;
