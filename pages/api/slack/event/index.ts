import { createHandler } from "@api/handler";
import { createTagTemp } from "@lib/conversation/api/convoService";
import { createSlackManualMessage } from "@lib/messages/api/messageService";

const handler = createHandler();

handler.post(async (req, res) => {
  if (req.body.event.thread_ts) {
    const body = JSON.stringify(req.body);

    await createTagTemp(body);
    // if reply is from RetainBoss bot then do not continue
    if (req.body.event.bot_id && req.body.event.app_id)
      return res.sendSuccess({
        type: "url_verification",
        token: req.body.token,
        challenge: req.body.challenge,
      });
    await createSlackManualMessage(
      req.body.event.thread_ts,
      req.body.event.text
    );
  }

  return res.sendSuccess({
    type: "url_verification",
    token: req.body.token,
    challenge: req.body.challenge,
  });
});
export default handler;
