import { createHandler } from "@api/handler";
import { ERROR_MESSAGES } from "@util/errors";

const handler = createHandler();

handler.get(async (req, res) => {
  if (req.user) {
    res.sendSuccess(req.user);
  } else {
    res.sendError(401, ERROR_MESSAGES.UNAUTHORIZED, "not-logged-in");
  }
});

export default handler;
