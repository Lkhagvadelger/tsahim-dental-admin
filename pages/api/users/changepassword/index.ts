import { createHandler } from "@api/handler";
// import { subject } from "@casl/ability";
import {
  getUsers,
  createUser,
  updateUser,
  changePassword,
} from "@lib/user/api/userService";
import { ERROR_MESSAGES } from "@util/errors";

const handler = createHandler();

handler.put(async (req, res) => {
  try {
    if (!req.user)
      return res.sendError(401, ERROR_MESSAGES.UNAUTHORIZED, "unauthorized");

    if (!req.body.password)
      return res.sendError(400, ERROR_MESSAGES.BAD_REQUEST, "password-missing");
    if (!req.body.id)
      return res.sendError(400, ERROR_MESSAGES.BAD_REQUEST, "body-id-missing");
    if (!req.query.id)
      return res.sendError(400, ERROR_MESSAGES.BAD_REQUEST, "query-id-missing");
    if (req.user.id != req.body.id)
      return res.sendError(401, ERROR_MESSAGES.UNAUTHORIZED, "unauthorized");

    if ((req.body.password as string).length < 8)
      return res.sendError(
        400,
        ERROR_MESSAGES.BAD_REQUEST,
        "password-length-must-be-over-8"
      );

    const id = req.query.id as string;
    if (id == req.body.id && req.user.id == req.body.id) {
      const user = await changePassword({
        userId: id,
        password: req.body.password,
      });
      return res.sendSuccess(user);
    }
    return res.sendSuccess({});
  } catch (error) {
    res.sendError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
});

export default handler;
