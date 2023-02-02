import { createHandler } from "@api/handler";
import { upsertUserFromBubble } from "@lib/user/api/userService";
import { BubbleUser } from "@lib/user/api/usertypes";
import { ERROR_MESSAGES } from "@util/errors";

const handler = createHandler();

handler.post(async (req, res) => {
  try {
    const bubbleUser: BubbleUser = req.body;
    if (!bubbleUser.uniqueID)
      return res.sendError(
        400,
        ERROR_MESSAGES.BAD_REQUEST,
        "Bubble unique id is required"
      );
    if (!bubbleUser.email)
      return res.sendError(
        400,
        ERROR_MESSAGES.BAD_REQUEST,
        "Email is required"
      );
    if (!bubbleUser.verifiedPhone)
      return res.sendError(
        400,
        ERROR_MESSAGES.BAD_REQUEST,
        "Phonenumber is required"
      );
    if (!bubbleUser.timezone)
      return res.sendError(
        400,
        ERROR_MESSAGES.BAD_REQUEST,
        "Time zone is required"
      );
   
    const user: any = await upsertUserFromBubble(bubbleUser);

    return res.sendSuccess(user);
  } catch (error) {
    console.log(error);
    res.sendError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
});

export default handler;
