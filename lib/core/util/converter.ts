
export const convertInchesToFeetInches = (inches: number) => {
  var feet = Math.floor(inches / 12);
  var inch = inches % 12;
  return feet + " feet" + (inch == 0 ? "" : " " + inch + " inches");
};

export const displayTimeByTimeZone = (timeZone: string) => {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: timeZone,
    timeStyle: "long",
    dateStyle: "short",
  });
  return formatter.format(new Date());
};
export const is30MinutesAgo = (date?: Date | null) => {
  if (!date) return false;
  const now = new Date();
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
  return date >= thirtyMinutesAgo && date <= now;
};
export const getDateInTimezone = (timeZone: string) => {
  return new Date(new Date().toLocaleString("default", { timeZone: timeZone }));
};
export const isSameDay = (
  date1: Date | null | undefined,
  date2: Date | null | undefined
) => {
  if (date1 === null || date2 === null) return false;
  if (date1 === undefined || date2 === undefined) return false;
  const dateA = new Date(date1);
  const dateB = new Date(date2);
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};
export const compareTimePassed = (
  currentHour: number,
  currentMinute: number,
  hour: number,
  minute: number
) => {
  if (
    currentHour > hour ||
    (currentHour === hour && currentMinute >= minute)
  ) {
    return true;
  } else {
    return false;
  }
};
export const convertTo24Hour = (time: string) => {
  const hours = parseInt(time.substr(0, 2));
  if (time.indexOf("AM") != -1 && hours == 12) {
    time = time.replace("12", "0");
  }
  if (time.indexOf("AM") != -1 && hours < 10) {
    time = time.replace(hours + "", "0" + hours);
  }
  if (time.indexOf("AM") != -1 && hours < 12) {
    time = time.replace("AM", "");
  }
  if (time.indexOf("PM") != -1 && hours < 12) {
    time = time.replace(hours + "", hours + 12 + "");
    time = time.replace("PM", "");
  }
  return time.trimEnd().trimStart();
};
export const getHourBasedOnTimezone = (timeZone: string) => {
  const date = new Date();

  const timeInTimezone = new Intl.DateTimeFormat("en-GB", {
    timeStyle: "short",
    timeZone,
  }).format(date);

  return parseInt(timeInTimezone.split(":")[0]);
};
export const getMinuteBasedOnTimezone = (timeZone: string) => {
  const date = new Date();

  const timeInTimezone = new Intl.DateTimeFormat("en-GB", {
    timeStyle: "short",
    timeZone,
  }).format(date);

  return parseInt(timeInTimezone.split(":")[1]);
};
export const getBotNameBasedOnTimeZone = (
  timeZone: string,
  checkingBotName?: string
) => {
  const date = new Date();

  const timeInTimezone = new Intl.DateTimeFormat("en-GB", {
    timeStyle: "short",
    timeZone,
  }).format(date);

  const hour = parseInt(timeInTimezone.split(":")[0]);

  let botName = "";
  if (hour < 12) {
    botName = "Morning bot";
  } else if (hour < 18) {
    botName = "Afternoon bot";
  } else {
    botName = "Evening bot";
  }
  if (checkingBotName) {
    if (checkingBotName === botName) {
      return botName;
    }
    return "";
  }
  return botName;
};
