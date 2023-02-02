import { createHandler } from "@api/handler"; 
import { ERROR_MESSAGES } from "@util/errors";

const handler = createHandler();

handler.patch(async (req, res) => {
  try {
    res.sendSuccess(
     {}
    );
  } catch (error) {
    res.sendError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
});

export default handler;
