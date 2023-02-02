import { createHandler } from "@api/handler";
import { createSlackManualMessage } from "@lib/messages/api/messageService";

const handler = createHandler();        

handler.get(async (req, res) => {
  // const a = await postMessage("#boss-users", "+97688109008, Asia/Ulaanbaatar, <!here>");
  // console.log(a);
  const id = req.query.id as string
  await createSlackManualMessage(id, "reply from slack");
  return res.sendSuccess({});
});
export default handler;
