import { createHandler } from "@api/handler";
import { compareUserPassword, changePassword } from "@lib/user/api/userService";
import { validatePassword } from "@lib/user/data/validators";
import { ERROR_MESSAGES } from "@util/errors";

const handler = createHandler();

handler.put(async (req, res) => {
  try {
    if (!validatePassword(req.body.password))
      return res.sendError(
        400,
        ERROR_MESSAGES.BAD_REQUEST,
        "validation-password"
      );
    if (!(await compareUserPassword(req.user?.id, req.body.current)))
      return res.sendError(
        400,
        ERROR_MESSAGES.BAD_REQUEST,
        "validation-current-password"
      );
    res.sendSuccess(
      await changePassword({
        userId: req.user?.id,
        password: req.body.password,
      })
    );
  } catch (error) {
    res.sendError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
});

export default handler;
