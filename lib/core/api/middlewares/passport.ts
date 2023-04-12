import * as passport from "passport";
import {
  serializeUser,
  deserializeUser,
  localStrategy,
  bearerStrategy,
} from "@lib/auth/api/service";

passport.use(localStrategy);
passport.use("jwt", bearerStrategy);

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

export { passport };
