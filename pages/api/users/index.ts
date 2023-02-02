import { createHandler } from "@api/handler";
import { sendPasswordRecoveryMail } from "@lib/auth/api/emailservice/mailService";
// import { subject } from "@casl/ability";
import { getUsers, createUser, updateUser } from "@lib/user/api/userService";
import { regexs } from "@ui/helpers/regexs";
import { ERROR_MESSAGES } from "@util/errors";

const handler = createHandler();

handler
  .get(async (req, res) => {
    try {
      if (!req.user)
        return res.sendError(401, ERROR_MESSAGES.UNAUTHORIZED, "unauthorized");
      if (req.user.role === "ADMIN") return res.sendSuccess(await getUsers());
      return res.sendSuccess([]);
    } catch (error) {
      res.sendError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  })
  .put(async (req, res) => {
    try {
      console.log(req.body)
      if (!req.user)
        return res.sendError(401, ERROR_MESSAGES.UNAUTHORIZED, "unauthorized");

      if (!req.body.id)
        return res.sendError(
          400,
          ERROR_MESSAGES.BAD_REQUEST,
          "body-id-missing"
        );
      if (!req.query.id)
        return res.sendError(
          400,
          ERROR_MESSAGES.BAD_REQUEST,
          "query-id-missing"
        );
      if (!req.body.firstName)
        return res.sendError(
          400,
          ERROR_MESSAGES.BAD_REQUEST,
          "firstName-missing"
        );
      if (!req.body.lastName)
        return res.sendError(
          400,
          ERROR_MESSAGES.BAD_REQUEST,
          "lastName-missing"
        );
     
      if (req.query.id != req.body.id)
        return res.sendError(
          400,
          ERROR_MESSAGES.BAD_REQUEST,
          "query-id-body-id-not-matching"
        );
      const id = req.query.id;

      if (id == req.body.id && req.user.id == req.body.id) {
        const user = await updateUser(
          req.user.id,
          req.body.firstName,
          req.body.lastName,
        );
        return res.sendSuccess(user);
      }
    } catch (error) {
      res.sendError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  });

export default handler;
