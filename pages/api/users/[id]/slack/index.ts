import { createHandler } from "@api/handler";
import {
  createNewSlackPostId,
  toggleUserAutpReply,
} from "@lib/user/api/userService";

const handler = createHandler();

handler.put(async (req, res) => {
  try {
    res.sendSuccess(await createNewSlackPostId(req.body.id));
  } catch (error) {
    res.sendError(error);
  }
});
export default handler;
