import { createHandler } from "@api/handler";
import { validateBody } from "@api/middlewares/bodyValidation";
import {
  createUser,
  createUserFromAdmin,
  deleteUserFromAdmin,
  getUserByEmail,
  getUserById,
  getUserByPhone,
  updateUserFromAdmin,
} from "@lib/user/api/userService";
import { ERROR_MESSAGES } from "@util/errors";

const handler = createHandler();

handler
  .post(async (req, res) => {
    try {
      console.log(req.body);
      if ((await getUserByEmail(req.body.email)) !== null)
        return res.sendError(
          400,
          "email already registered.",
          "registeredUser"
        );
      if ((await getUserByPhone(req.body.phoneNumber)) !== null)
        return res.sendError(
          400,
          "Phone number already registered.",
          "registeredUser"
        );

      const user:any = await createUserFromAdmin(
        req.body.email,
        req.body.password,
        req.body.phoneNumber,
        req.body.firstName,
        req.body.lastName,
        req.body.role,
        req.body.timeZone
      );

      return res.sendSuccess(user);
    } catch (error) {
      console.log(error);
      res.sendError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  })
  .put(async (req, res) => {
    try {
      const id = req.query.id;
      if (id == req.body.id) {
        const user = await updateUserFromAdmin(
          req.body.id,
          req.body.email,
          req.body.password,
          req.body.phoneNumber,
          req.body.firstName,
          req.body.lastName,
          req.body.role,
          req.body.timeZone
        );
        return res.sendSuccess(user);
      }
      return res.sendError(400, ERROR_MESSAGES.BAD_REQUEST, "registeredUser");
    } catch (error) {
      console.log(error);
      res.sendError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  })
  .delete(async (req, res) => {
    try {
      const user = await deleteUserFromAdmin(req.body.id);

      return res.sendSuccess({ success: true });
    } catch (error) {
      console.log(error);
      res.sendError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  });

export default handler;
