import { createHandler } from "@api/handler";
// import { subject } from "@casl/ability";
import { getUserDetailById } from "@lib/user/api/userService";
import { ERROR_MESSAGES } from "@util/errors";

const handler = createHandler();

handler
  .get(async (req, res) => {
    try {
      if (!req.user)
        return res.sendError(401, ERROR_MESSAGES.UNAUTHORIZED, "unauthorized");
      
      if (req.user.role === "ADMIN") return res.sendSuccess(await getUserDetailById(req.query.id as string));
      return res.sendSuccess([]);
    } catch (error) {
      res.sendError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  })

export default handler;
