import { createHandler } from "@api/handler";
import { sendSlackMessage } from "@api/slack";

const handler = createHandler();

handler.get(async (req, res) => {
  try {
    const conversationUrl = `Conversation link: <https://boss.retaingoals.com/chat/asdfasdf>`;
    await sendSlackMessage(`#flagged-messages`, "Input text: compiled client and server successfully in 200 ms" + "\n" + conversationUrl);
    res.sendSuccess({ message: `Marka is flagged!!` });
  } catch (error) {
    res.sendError(error);
  }
});

export default handler;
