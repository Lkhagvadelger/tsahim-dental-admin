const axios = require("axios");
const isDev = process.env.NODE_ENV !== "production";
const API_URL = process.env.NEXT_PUBLIC_API_URL ||  "http://localhost:3400";
export const doNothing = () => {};
(async () => {
  //
  if (isDev)
    console.log((await axios.get(`http://localhost:3400/api/bot/timer`)).data);
  else {
    console.log(
      (await axios.get(`${API_URL}/bot/timer`)).data
    );
    console.log("DONE.");
  }
})()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {});
