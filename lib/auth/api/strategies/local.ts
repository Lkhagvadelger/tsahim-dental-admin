import { compare } from "bcryptjs";
import { Strategy } from "passport-local";
import {
  getUserPasswordDigest,
  getUserPasswordDigestByPhone,
} from "@lib/user/api/userService";
import { validatePhoneNumber } from "@lib/user/data/validators";

export const localStrategy = new Strategy(
  { usernameField: "email" },
  async (phoneOrEmail, password, callback) => {
    // if (validatePhoneNumber(phoneOrEmail, "mn").isValid) {
    //   console.log("phone login", phoneOrEmail);
    //   // email is phone number
    //   console.log(phoneOrEmail);
    //   const { user, passwordDigest } = await getUserPasswordDigestByPhone(
    //     phoneOrEmail
    //   );
    //   console.log(user);
    //   const finalUser =
    //     passwordDigest && (await compare(password, passwordDigest))
    //       ? user
    //       : null;

    //   if (!finalUser) {
    //     return callback({ message: "invalid-credentials" }, false);
    //   }

    //   return callback(null, finalUser);
    // }
    //(validateEmail(phoneOrEmail))
    //else 
      const { user, passwordDigest } = await getUserPasswordDigest(
        phoneOrEmail
      );
      const finalUser =
        passwordDigest && (await compare(password, passwordDigest))
          ? user
          : null;
      if (!finalUser) {
        return callback({ message: "invalid-credentials" }, false);
      }

      return callback(null, finalUser);
  }
);
