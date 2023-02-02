import { getUserPasswordDigest } from "@lib/user/api/userService";
import { Strategy, ExtractJwt } from "passport-jwt";
import { compare } from "bcryptjs";

export const bearerStrategy = new Strategy(
  {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: (req) => {
      return (
        ExtractJwt.fromAuthHeaderAsBearerToken()(req) ||
        ExtractJwt.fromUrlQueryParameter("t")(req)
      );
    },
  },
  async (token, done) => {
    try {
      return done(null, token.user);
    } catch (error) {
      done(error);
    }
  }
);
