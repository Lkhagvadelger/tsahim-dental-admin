import { createHandler } from "@api/handler";
import {
    createManualMessage
} from "@lib/messages/api/messageService";

const handler = createHandler();

handler.post(async (req, res) => {
  try {
    await createManualMessage(
      req.body.conversationId as string,
      req.body.input as string,
      req.body.sendSMS as boolean
    );
    res.sendSuccess({});
  } catch (error) {
    res.sendError(error);
  }
});

export default handler;
