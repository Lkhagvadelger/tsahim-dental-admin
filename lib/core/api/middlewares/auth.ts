import { AppRequest, AppResponse } from "../types";
import { ERROR_MESSAGES } from "@util/errors";
import passport from "passport";

export const extractUserFromJwt = (
  req: AppRequest,
  res: AppResponse,
  next: () => void
) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (user) req.user = user;
    next();
  })(req, res, next);
};

export const authorize = (
  req: AppRequest,
  res: AppResponse,
  next: () => void
) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!req.user)
      return res.sendError(401, ERROR_MESSAGES.UNAUTHORIZED, "not-logged-in");
    next();
  })(req, res, next);
};

function authorizedByBearer(user: any) {
  return user;
}

function notAuthorizedBothSessionAndBearer(user: any, req: AppRequest) {
  return !user && !req.user;
}
