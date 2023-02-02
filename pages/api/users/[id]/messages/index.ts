import { createHandler } from "@api/handler";
import {
  getMessagesByBubbleId,
  getMessagesByUserId,
} from "@lib/messages/api/messageService";

const handler = createHandler();

handler
  .post(async (req, res) => {
    try {
      if (req.body.bubbleId)
        res.sendSuccess(
          await getMessagesByBubbleId(req.body.bubbleId as string)
        );
      else res.sendSuccess([]);
    } catch (error) {
      res.sendError(error);
    }
  })
  .get(async (req, res) => {
    try {
      if (req.query.id)
        res.sendSuccess(await getMessagesByUserId(req.query.id as string));
      else res.sendSuccess([]);
    } catch (error) {
      res.sendError(error);
    }
  });
export default handler;
