import { AppRequest, AppResponse } from "../types";
import { ERROR_MESSAGES } from "@util/errors";
import { validationResult } from "express-validator";

export const validateBody = (
  req: AppRequest,
  res: AppResponse,
  next: () => void
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .send({
        status: "fail",
        message: "invalid request inputs",
        info: errors.array(),
      });
  }
  next();
};
