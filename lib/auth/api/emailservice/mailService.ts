import nodemailer from "nodemailer";
import { prisma } from "@api/prisma";
import { google } from "googleapis";
const OAuth2 = google.auth.OAuth2;
const myOAuth2Client = new OAuth2(
  process.env.MAIL_SERVICE_ACC_CLIENT_ID,
  process.env.MAIL_SERVICE_ACC_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);
myOAuth2Client.setCredentials({
  refresh_token: process.env.MAIL_SERVICE_ACC_REFRESH_TOKEN,
});

export const sendEmailValidationCode = async (
  receiverMail: string,
  code: string
) => {
  return new Promise((resolve, reject) => {
    transporter().then((trans) =>
      trans
        .sendMail({
          from:
            process.env.NEXT_PUBLIC_APP_NAME +
            " " +
            process.env.MAIL_SERVICE_EMAIL_ADDRESS, // sender address
          to: `${receiverMail}`, // list of receivers
          subject:
            process.env.NEXT_PUBLIC_APP_NAME +
            " имэйл хаягаа баталгаажуулна уу", // Subject line
          text: `Таны имэйл хаягийн баталгаажуулах код: ${code}.`, // plain text body
          html: `<p>Таны имэйл хаягийн баталгаажуулах код: ${code}</p>
        `, // html body
        })
        .then((info) => {
          resolve(true);
          trans.close();
        })
        .catch(reject)
    );
  });
};

export const sendPasswordRecoveryMail = async (
  email: string,
  code: string,
) => {
  return new Promise((resolve, reject) => {
    transporter().then((trans) =>
      trans
        .sendMail({
          from:
            process.env.NEXT_PUBLIC_APP_NAME +
            " " +
            process.env.MAIL_SERVICE_EMAIL_ADDRESS, // sender address
          to: `${email}`, // list of receivers
          subject: process.env.NEXT_PUBLIC_APP_NAME + " нууц үг сэргээх", // Subject line
          text: `Дараах кодыг ашиглан нууц үгээ сэргээнэ үү!`,
          html: `<p>Таны нууц үгээ сэргээх код: ${code}</p>`,
        })
        .then((info) => {
          resolve(true);
          trans.close();
        })
        .catch((e)=>{
          console.log(e)
        })
    );
  });
};

const transporter = async () => {
  const myAccessToken = await myOAuth2Client.getAccessToken();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_SERVICE_EMAIL_ADDRESS,
      clientId: process.env.MAIL_SERVICE_ACC_CLIENT_ID,
      clientSecret: process.env.MAIL_SERVICE_ACC_CLIENT_SECRET,
      refreshToken: process.env.MAIL_SERVICE_ACC_REFRESH_TOKEN,
      accessToken: myAccessToken.token!,
    },
  });
  return transporter;
};
