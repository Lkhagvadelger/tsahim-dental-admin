import { AppRequest, AppResponse } from "../types";
import { defineRulesFor } from "@lib/auth/api/abilities";

export const abilityMiddleware = (
  req: AppRequest,
  _: AppResponse,
  next: () => void
) => {
  req.ability = defineRulesFor(req.user);
  next();
};
