import nc from "next-connect";

import { AppRequest, AppResponse } from "./types";
import { trustProxyMiddleware } from "./middlewares/trust-proxy";
import { responseMiddleware } from "./middlewares/response";
import { sessionMiddleware } from "./middlewares/session";
import { passport } from "./middlewares/passport";
import { abilityMiddleware } from "./middlewares/ability";
import { extractUserFromJwt } from "./middlewares/auth";

const middlewares = [
  trustProxyMiddleware,
  responseMiddleware,
  sessionMiddleware,
  passport.initialize(),
  passport.session(),
  extractUserFromJwt,
  abilityMiddleware,
];

export const createHandler = (options = {}) => {
  return nc<AppRequest, AppResponse>({
    onError: (err, _, res) => {
      console.error(err);
      res.status(500).end(err.toString());
    },
    onNoMatch: (_, res) => {
      res.status(404).end("Page is not found");
    },
    ...options,
  }).use(...middlewares);
};
