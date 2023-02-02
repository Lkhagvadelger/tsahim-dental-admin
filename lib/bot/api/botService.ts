import { getActiveUsers } from "../../user/api/userService";
import {
  compareTimePassed,
  convertTo24Hour,
  getBotNameBasedOnTimeZone,
  getDateInTimezone,
  getHourBasedOnTimezone,
  getMinuteBasedOnTimezone,
  is30MinutesAgo,
  isSameDay,
} from "../../core/util/converter";
import { IsTimeBasedFunctionAllowed, runDailyBot } from "./service";
if (process.env.NODE_ENV !== "production") global.prisma = prisma;
// get users

// morning users list
// afternoon users list
// evening user list
type TimeBasedUserType = {
  userId: string;
  userCurrentDate: Date;
  userCurrentHour: number;
  userCurrentMinute: number;
  isMorning: string;
  isAfternoon: string;
  isEvening: string;
  isConv30MinAgo: boolean;
  isTodaysMorningSMSSent: boolean;
  isTodaysAfternoonSMSSent: boolean;
  isTodaysEveningSMSSent: boolean;
  wakeupTime: string;
  sleepTime: string;
  botToRun: string;
};
type ActiveUserType = {
  id: string;
  email: string;
  phoneNumber: string;
  isActive: boolean | null;
  timeZone: string | null;
  createdAt: Date;
  profile: any;
  userBots:
    | {
        createdAt: Date;
        bot: { name: string };
      }[]
    | null;
  conversation:
    | {
        messages: { createdAt: Date }[] | null;
      }[]
    | null;
};
export const timerBasedLogic = async () => {
  if (!(await IsTimeBasedFunctionAllowed())) {
    console.log("Time based function is not allowed!");
    return {};
  }
  const users: ActiveUserType[] = await getActiveUsers();
  const userTimeBased: TimeBasedUserType[] = [];

  users.forEach(async (user: ActiveUserType) => {
    if (!user.timeZone) return {};
    if (!user.profile?.profileData) return {};

    const lastMessageDate =
      user?.conversation &&
      user?.conversation[0]?.messages &&
      user?.conversation[0]?.messages[0]?.createdAt;

    const lastBots = user?.userBots && user?.userBots;
    const userCalculatedData: TimeBasedUserType = {
      botToRun: "",
      userId: user.id,
      userCurrentDate: getDateInTimezone(user.timeZone),
      userCurrentHour: getHourBasedOnTimezone(user.timeZone),
      userCurrentMinute: getMinuteBasedOnTimezone(user.timeZone),
      isMorning: getBotNameBasedOnTimeZone(user.timeZone, "Morning bot"),
      isAfternoon: getBotNameBasedOnTimeZone(user.timeZone, "Afternoon bot"),
      isEvening: getBotNameBasedOnTimeZone(user.timeZone, "Evening bot"),
      isConv30MinAgo: is30MinutesAgo(lastMessageDate),
      wakeupTime: convertTo24Hour(user.profile.profileData.wakeupTime),
      sleepTime: convertTo24Hour(user.profile.profileData.sleepTime),
      isTodaysMorningSMSSent: isSameDay(
        lastBots?.filter((r) => r.bot.name == "Morning bot")[0]?.createdAt,
        new Date()
      ),
      isTodaysAfternoonSMSSent: isSameDay(
        lastBots?.filter((r) => r.bot.name == "Afternoon bot")[0]?.createdAt,
        new Date()
      ),
      isTodaysEveningSMSSent: isSameDay(
        lastBots?.filter((r) => r.bot.name == "Evening bot")[0]?.createdAt,
        new Date()
      ),
    };

    if (userCalculatedData.isConv30MinAgo === false) {
      if (
        userCalculatedData.isMorning == "Morning bot" &&
        !userCalculatedData.isTodaysMorningSMSSent
      ) {
        if (
          compareTimePassed(
            userCalculatedData.userCurrentHour,
            userCalculatedData.userCurrentMinute,
            parseInt(userCalculatedData.wakeupTime.split(":")[0]),
            parseInt(userCalculatedData.wakeupTime.split(":")[1])
          )
        ) {
          // should run in 30 minutes after wakeup time
          userCalculatedData.botToRun = userCalculatedData.isMorning;
        }
      }
      if (
        userCalculatedData.isAfternoon == "Afternoon bot" &&
        !userCalculatedData.isTodaysAfternoonSMSSent
      ) {
        if (
          compareTimePassed(
            userCalculatedData.userCurrentHour,
            userCalculatedData.userCurrentMinute,
            13,
            0
          ) &&
          compareTimePassed(
            13,
            30,
            userCalculatedData.userCurrentHour,
            userCalculatedData.userCurrentMinute
          )
        ) {
          userCalculatedData.botToRun = userCalculatedData.isAfternoon;
          // should run between 13:00 to 13:30
        }
      }
      if (
        userCalculatedData.isEvening == "Evening bot" &&
        !userCalculatedData.isTodaysEveningSMSSent
      ) {
        if (
          compareTimePassed(
            userCalculatedData.userCurrentHour,
            userCalculatedData.userCurrentMinute,
            parseInt(userCalculatedData.sleepTime.split(":")[0]) - 1,
            parseInt(userCalculatedData.wakeupTime.split(":")[1])
          )
        ) {
          userCalculatedData.botToRun = userCalculatedData.isEvening;
          // should run in 60 minutes before sleep time
        }
      }
    }
    // userTimeBased.push(userCalculatedData);
    // if (process.env.NODE_ENV === "production")
    //   await runDailyBot(
    //     userCalculatedData.botToRun,
    //     userCalculatedData.userId,
    //     user.profile?.firstName + "",
    //     user.phoneNumber
    //   );
    // convert date to all users timezone
    // check if date is today for them
    // check is the time to start conversation
    // check do we have any conversation for last hour
    // if now conversation then start conversation with desired bot
  });
  return userTimeBased;
};
