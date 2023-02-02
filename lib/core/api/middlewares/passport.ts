import * as passport from "passport";
import {
  serializeUser,
  deserializeUser,
  localStrategy,
  facebookStrategy,
  googleStrategy,
  bearerStrategy,
} from "@lib/auth/api/service";

passport.use(localStrategy);
passport.use(facebookStrategy);
passport.use(googleStrategy);
passport.use("jwt", bearerStrategy);

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

export { passport };
