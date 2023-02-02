import { createHandler } from "@api/handler";

const handler = createHandler();

handler.delete((req, res) => {
  req.logout();
  res.sendSuccess({});
});

export default handler;
