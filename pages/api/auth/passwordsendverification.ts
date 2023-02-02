import { createHandler } from "@api/handler";
import { validateBody } from "@api/middlewares/bodyValidation";
import { sendPasswordRecoveryMail } from "@lib/auth/api/emailservice/mailService";
import { sendVerificationCode } from "@lib/auth/api/smsapi/smsservice";
// import { sendEmailValidationCode } from "@lib/user/api/mailService";
import {
  getUserByEmail,
  getUserByPhone,
} from "@lib/user/api/userService";
import { validatePhoneNumber } from "@lib/user/data/validators";
import { ERROR_MESSAGES } from "@util/errors";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

const handler = createHandler();


handler.post( async (req, res) => {
  try {
    if ((await getUserByPhone(req.body.phoneNumber)) == null)
    return res.sendError(400, "PhoneNumber Not Found!", "notRegisteredUser");

    
    // await sendPasswordRecoveryMail(req.body.email!, validationCode.code!);
    const validate = validatePhoneNumber(
      parseInt(req.body.phoneNumber),
      req.body.countryCode
    );
    
    if (!validate.isValid)
    return res.sendError(
      400,
      ERROR_MESSAGES.BAD_REQUEST,
      "invalid-phone-number"
    );

  await sendVerificationCode({ phoneNumber: validate.fullPhoneNumber })
    .then((message: any) => {
      if (message == 0) return res.sendError(400, ERROR_MESSAGES.BAD_REQUEST);
      return res.sendSuccess({
        valid: true,
        message: message,
      });
    })
    .catch((error) => {
      console.log("error:", error);
      return res.sendError(error.status, ERROR_MESSAGES.BAD_REQUEST);
    });
  } catch (error) { 
    res.sendError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
});

export default handler;
 
