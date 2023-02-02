import { createHandler } from "@api/handler";

import { ERROR_MESSAGES } from "@util/errors";

const handler = createHandler();

handler.get(async (req, res) => {
  try {
    res.sendSuccess({
    });
  } catch (error) {
    res.sendError(error);
  }
});
export default handler;
