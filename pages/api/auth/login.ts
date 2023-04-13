import * as passport from "passport";
import { createHandler } from "@api/handler";
import { ERROR_MESSAGES } from "@util/errors";
import jwt from "jsonwebtoken";

const handler = createHandler();

handler.post(async (req, res, next) => {
  passport.authenticate("local", (err:any, user:any) => {
    if (err || !user) {
      return res.sendError(401, ERROR_MESSAGES.UNAUTHORIZED, err.message);
    }
    req.login(user, (err) => {
      if (err) return res.sendError(401, ERROR_MESSAGES.UNAUTHORIZED);

      if (!req.query.type || req.query.type === "session") {
        req.session.userId = user.id;
        return res.sendSuccess(user);
      }

      if (req.query.type === "jwt") {
        const body = {
          id: user.id,
          email: user.email,
          username: user?.firstName,
        };

        if (!process.env.JWT_SECRET)
          throw new Error("Jwt secret not provided in env");

        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
          expiresIn: "365d",
          issuer: "boss.retaingoals.com",
        });

        return res.json({ ...user, token });
      }
    });
  })(req, res, next);
});

export default handler;
