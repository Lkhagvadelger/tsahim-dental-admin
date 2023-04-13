import * as passport from "passport";
import { createHandler } from "@api/handler";
import { ERROR_MESSAGES } from "@util/errors";
import { deleteUser } from "@lib/auth/api/service";

const handler = createHandler();

handler.delete(async (req, res) => {
  if (req.user) {
    await deleteUser(req.user.id, req.user.phoneNumber, req.user.email);
    req.logout;
    res.sendSuccess({ success: true });
  } else {
    res.sendError(401, ERROR_MESSAGES.UNAUTHORIZED, "not-logged-in");
  }
});
export default handler;
