import { createHandler } from "@api/handler";
import { validateBody } from "@api/middlewares/bodyValidation";
import { confirmVerificationCode } from "@lib/auth/api/smsapi/smsservice";
import {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByPhone,
} from "@lib/user/api/userService";
import { ERROR_MESSAGES } from "@util/errors";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

const handler = createHandler();

const validation = [
  body("firstName").isLength({ min: 4 }),
  body("phoneNumber").isLength({ min: 8, max: 8 }),
  body("email").isEmail(),
  body("password").isLength({ min: 8 }), 
  validateBody,
];

handler.post(...validation, async (req, res) => {
  try {
    if ((await getUserByEmail(req.body.email)) !== null)
      return res.sendError(400, "User email already registered!", "registeredUser");
    if ((await getUserByPhone(req.body.phoneNumber)) !== null)
      return res.sendError(400, "User phone number already registered!", "registeredUser");

    const result = await confirmVerificationCode({phoneNumber: req.body.phoneNumber, code: req.body.code})
  
    if (result != 1)
      return res.sendError(
        400,
        ERROR_MESSAGES.BAD_REQUEST,
        "wrong-verification-code"
      );

    const user = await createUser(
      req.body.email,
      req.body.password,
      req.body.phoneNumber,
      req.body.firstName,
    );
    const body = { id: user.id, email: user.email, role: user.role };
    if (!process.env.JWT_SECRET)
      throw new Error("Jwt secret not provided in env");

    req.login(user, (err: any) => {
      if (err) return res.sendError(401, ERROR_MESSAGES.UNAUTHORIZED);
      req.session.userId = user.id;
      return res.sendSuccess(user);
    });
  } catch (error) {
    console.log(error);
    res.sendError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
});

export default handler;
