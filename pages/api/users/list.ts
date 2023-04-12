import { createHandler } from "@api/handler";
import { getUsersFilter } from "@lib/user/api/userService";
import { ERROR_MESSAGES } from "@util/errors";

const handler = createHandler();

handler.post(async (req, res) => {
  try {
    if (!req.user)
      return res.sendError(401, ERROR_MESSAGES.UNAUTHORIZED, "unauthorized");
    return res.sendSuccess(await getUsersFilter(req.body));
  } catch (error) {
    res.sendError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
});

export default handler;
