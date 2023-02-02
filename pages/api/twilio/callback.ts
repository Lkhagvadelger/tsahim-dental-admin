import { createHandler } from "@api/handler";
import { getMessageDeliveryCallback } from "@lib/messages/api/messageService";

const handler = createHandler();

handler.post(async (req, res) => {
  await getMessageDeliveryCallback(req.body);

  return res.sendSuccess({});
});
export default handler;
