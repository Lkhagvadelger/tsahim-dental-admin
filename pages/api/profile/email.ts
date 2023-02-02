import { createHandler } from "@api/handler";
import {
  compareUserPassword,
  changeEmail,
  checkEmailNotExists,
} from "@lib/user/api/userService";
import { validateEmail } from "@lib/user/data/validators";
import { ERROR_MESSAGES } from "@util/errors";

const handler = createHandler();

handler.put(async (req, res) => {
  try {
    if (!validateEmail(req.body.email))
      return res.sendError(400, ERROR_MESSAGES.BAD_REQUEST, "validation-email");
    if (!(await compareUserPassword(req.user?.id, req.body.password)))
      return res.sendError(
        400,
        ERROR_MESSAGES.BAD_REQUEST,
        "validation-current-password"
      );
    if (!(await checkEmailNotExists(req.body.email)))
      return res.sendError(
        400,
        ERROR_MESSAGES.BAD_REQUEST,
        "validation-email-duplicate"
      );
    res.sendSuccess(
      await changeEmail({
        userId: req.user?.id,
        email: req.body.email.toLowerCase(),
      })
    );
  } catch (error) {
    res.sendError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
});

export default handler;
