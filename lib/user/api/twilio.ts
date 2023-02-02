import { Twilio } from "twilio";
const client = new Twilio(
  `${process.env.TWILIO_ACCOUNT_SID}`,
  `${process.env.TWILIO_AUTH_TOKEN}`
);
export const sendVerificationCode = async (to: string) => {
  //before call this function phone number must be validated
  const random6DigitCode = Math.floor(100000 + Math.random() * 900000);
  return client.verify
    .services(`${process.env.TWILIO_MESSAGING_VERIFICATION_SID}`)
    .verifications.create({
      to,
      channel: "sms",
    });
};
export const confirmVerificationCode = async (to: string, code: string) => {
  return client.verify
    .services(`${process.env.TWILIO_MESSAGING_VERIFICATION_SID}`)
    .verificationChecks.create({ to, code });
};

export const sendTwilioMessage = async (to: string, body: string) => {
  return client.messages.create({
    body,
    to,
    messagingServiceSid: `${process.env.TWILIO_MESSAGING_SERVICE_SID}`,
    statusCallback: `${process.env.TWILIO_CALLBACK}`,
    //   sendAt: new Date(
    //     Date.UTC(
    //       d.getFullYear(),
    //       d.getMonth(),
    //       d.getDate(),
    //       d.getHours(),
    //       d.getMinutes(),
    //       d.getSeconds()
    //     )
    //   ),
    //  scheduleType: "fixed",
  });
};
export const carrierLookup = async (to: string) => {
  return client.lookups.v1.phoneNumbers(to).fetch();
};
