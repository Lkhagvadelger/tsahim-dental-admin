import { isNumber } from "@chakra-ui/utils";

const headers = {
  "client-id": process.env.SMSAPI_CLIENT_ID!,
  "client-secret": process.env.SMSAPI_CLIENT_SECRET!,
  "content-type": "application/json",
};
const MASTER_CODE = 123456;
const verifiationURL = process.env.SMSAPI_URL + "/api/Verification/Verification";
const validationURL = process.env.SMSAPI_URL + "/api/Verification/Validate";
export const sendVerificationCode = async ({
  phoneNumber,
}: {
  phoneNumber: number;
}) => {
  return await fetch(verifiationURL, {
    method: "post",
    headers,
    body: JSON.stringify({
      phoneNumber,
      appId: 0,
      content: "Batalgaajuulakh code: {0}",
    }),
  })
    .then((response) => response.json())
    .then((jsonData) => {
      console.log(jsonData)
      if (isNumber(jsonData)) return jsonData;
      else return 0;
    })
    .catch((error) => {
      console.log(error)
      return 0;
    });
};
export const confirmVerificationCode = async ({
  phoneNumber,
  code,
}: {
  phoneNumber: number;
  code: number;
}) => {
  if (process.env.NODE_ENV == "development" && code == MASTER_CODE) return 1;
  return await fetch(validationURL, {
    method: "post",
    headers,
    body: JSON.stringify({ phoneNumber, appId: 0, code }),
  })
    .then((jsonData) => {
      return jsonData.json();
    })
    .then((resp) => {
      if (isNumber(resp)) return 1;
      else return 0;
    })
    .catch((error) => {
      console.error("sms verify error", error);
      return 0;
    });
};
