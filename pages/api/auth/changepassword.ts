import { createHandler } from "@api/handler";
import {
  changePassword
} from "@lib/user/api/userService";
import { ERROR_MESSAGES } from "@util/errors";

const handler = createHandler();

handler.put(async (req, res) => {
  try {
    const id = req.query.id;
    if (id == req.body.id) {
      const user = await changePassword({
        userId: req.body.id as string,
        password: req.body.password as string,
      });
      return res.sendSuccess(user);
    }
    return res.sendError(400, ERROR_MESSAGES.BAD_REQUEST, "changepassword");
  } catch (error) {
    console.log(error);
    res.sendError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
});

export default handler;
