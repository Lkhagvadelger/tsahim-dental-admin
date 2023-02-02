import { createHandler } from "@api/handler";
import { toggleUserAutpReply } from "@lib/user/api/userService";

const handler = createHandler();

handler.put(async (req, res) => {
  try {
    if (req.query.id)
      res.sendSuccess(
        await toggleUserAutpReply(
          req.query.id as string,
          req.body.autoReply as boolean
        )
      );
    else res.sendSuccess({});
  } catch (error) {
    res.sendError(error);
  }
});
export default handler;
