import { createHandler } from "@api/handler";
import { getConversationByUserId } from "@lib/conversation/api/convoService";

import { ERROR_MESSAGES } from "@util/errors";

const handler = createHandler();

handler.get(async (req, res) => {
  try {
    if (req.query.id)
      res.sendSuccess(await getConversationByUserId(req.query.id as string));
    else res.sendSuccess([]);
  } catch (error) {
    res.sendError(error);
  }
});
export default handler;
