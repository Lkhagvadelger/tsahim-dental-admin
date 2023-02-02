import { BubbleUserProfile } from "../api/usertypes";

export const validateEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password: string) => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(String(password).toLowerCase());
};
export const userPromptFilterAndModification = (
  userResponce: string 
) => {
  userResponce = userResponce.trim().replace(/[\n\t]/g, "");;
  return userResponce;
};
//Works on only Mongolian phone number
export const validatePhoneNumber = (
  phoneNumber: number,
  countryCode: String = "+976"
) => {
  const returnModel = { isValid: false, fullPhoneNumber: 0 };
  const countryCodes = [
    {
      regex: /^([0-9]{8})$/,
      length: 8,
      startingNumber: [
        "80",
        "83",
        "85",
        "86",
        "88",
        "89",
        "90",
        "91",
        "93",
        "94",
        "95",
        "96",
        "97",
        "98",
        "99",
        "92",
      ],
      startingLength: 2,
    },
  ];
  //All SMS receivable phone numbers
  // +XXXXXXXXXXX = (/^\+?([0-9]{3})\)?[-. ]?([0-9]{8})$/) verifing this format - Phone format for Mongolian Phone number providers
  // will add different formats for different countries
  // XXXXXXXX (/^?([0-9]{8})\)$/)
  const country = countryCodes[0];
  returnModel.fullPhoneNumber = phoneNumber;

  if (
    country.regex.test(phoneNumber.toString()) &&
    (country.startingNumber.length === 0 ||
      (country.startingNumber.length > 0 &&
        country.startingNumber.filter(
          (r) =>
            r == phoneNumber.toString().substring(0, country.startingLength)
        ).length > 0))
  ) {
    returnModel.isValid = true;
    returnModel.fullPhoneNumber = phoneNumber;
  }

  return returnModel;
};
