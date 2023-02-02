import { createHandler } from "@api/handler";
import { validateBody } from "@api/middlewares/bodyValidation";
import { confirmVerificationCode } from "@lib/auth/api/smsapi/smsservice";
import {
  changePassword,
  getUserByPhone,
} from "@lib/user/api/userService";
import { ERROR_MESSAGES } from "@util/errors";
import { body } from "express-validator";


const handler = createHandler();


handler.post( async (req, res) => {
  try {
    if ((await getUserByPhone(req.body.phoneNumber)) == null)
      return res.sendError(400, "phoneNumber Not Found!", "notRegisteredUser");


    const result = await confirmVerificationCode({phoneNumber: req.body.phoneNumber, code: req.body.code})
  
    if (result != 1)
      return res.sendError(
        400,
        ERROR_MESSAGES.BAD_REQUEST,
        "wrong-verification-code"
      );

    const password = req.body.password as string;
    const user = await getUserByPhone(req.body.phoneNumber);

    await changePassword({ userId: user?.id!, password: password });
    res.sendSuccess({
      isSuccess: true,
    });
  } catch (error) {
    console.log(error);
    res.sendError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
});

export default handler;
