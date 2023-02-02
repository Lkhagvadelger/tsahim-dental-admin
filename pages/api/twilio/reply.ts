import { createHandler } from "@api/handler";
import {
  userSMSReplyOfMessageV2
} from "@lib/messages/api/messageService";
const handler = createHandler();

//Create separated file for this
handler.post(async (req, res) => {
  try {
    if (req.body.Body && req.body.From)
      await userSMSReplyOfMessageV2(req.body.Body, req.body.From);

    res.sendSuccess({});
  } catch (error) {
    res.sendError(error);
  }
});

export default handler;
