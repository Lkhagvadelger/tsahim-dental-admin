import { createHandler } from "@api/handler";
const handler = createHandler();

handler.get(async (req, res) => {
  try {
    // await sendTwilioMessage("+97688109008", "comnoosd");
    res.sendSuccess({});
  } catch (error) {
    res.sendError(error);
  }
});

export default handler;
