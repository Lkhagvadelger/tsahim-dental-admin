import { prisma } from "@api/prisma";
import { slackPostMessage } from "@api/slack";
import { createConversationV2 } from "@lib/conversation/api/convoService";
import { UserRole } from "@prisma/client";
import { QueryParamType } from "@ui/hooks/query-param";
import { convertJsonProfileToProfile } from "@util/converter";
import { compare, hash } from "bcryptjs";
import { BubbleUser, BubbleUserProfile } from "./usertypes";

const saltRounds = 10;

const defaultSelectSecure = {
  id: true,
  email: true,
  emailVerified: true,
  phoneNumber: true,
  phoneNumberVerified: true,
  role: true,
  updatedAt: true,
  createdAt: true,
  passwordDigest: true,
  profile: true,
};
const defaultSelect = {
  id: true,
  email: true,
  emailVerified: true,
  phoneNumber: true,
  phoneNumberVerified: true,
  role: true,
  isActive: true,
  timeZone: true,
  autoReply: true,
  slackPostId: true,
  updatedAt: true,
  createdAt: true,
  passwordDigest: false,
  profile: true,
};
const defaultSelectDetail = {
  id: true,
  email: true,
  emailVerified: true,
  phoneNumber: true,
  phoneNumberVerified: true,
  role: true,
  isActive: true,
  timeZone: true,
  updatedAt: true,
  createdAt: true,
  passwordDigest: false,
  profile: true,
  userBots: true,
  conversation: true,
};

export const getUsers = async () => {
  return prisma.user.findMany({
    select: defaultSelect,
  });
};
export const getActiveUsers = async () => {
  return await prisma.user.findMany({
    where: { isActive: true, timeZone: { not: null } },
    select: {
      id: true,
      email: true,
      phoneNumber: true,
      isActive: true,
      timeZone: true,
      createdAt: true,
      profile: true,
      userBots: {
        where: {
          OR: [
            { bot: { name: "Morning bot" } },
            { bot: { name: "Afternoon bot" } },
            { bot: { name: "Evening bot" } },
          ],
        },
        select: {
          createdAt: true,
          bot: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      conversation: {
        select: {
          messages: {
            select: { createdAt: true },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
};
export const cancelSubscription = async (userId: string) => {
  return;
};
export const disabelUserAccount = async (
  userId: string,
  disabledReason: string
) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      isActive: false,
      disabledReason,
    },
  });
};
export const getUsersFilter = async (filter: QueryParamType) => {
  let size = Number(filter.size),
    page = Number(filter.page);

  if (size <= 0 || page <= 0) {
    size = 10;
    page = 1;
  }

  const filters: any | any[] = [];

  if (filter.text) {
    const fText = { contains: filter.text, mode: "insensitive" };
    filters.push({
      OR: [
        { email: fText },
        { phoneNumber: fText },
        { profile: { OR: [{ firstName: fText }, { lastName: fText }] } },
      ],
    });
  }
  const where =
    filters.length === 0
      ? {}
      : filters.length === 1
      ? filters[0]
      : { AND: filters };
  const total = await prisma.user.count({ where });

  return {
    total,
    pages: Math.ceil(total / size),
    data: await prisma.user.findMany({
      where,
      select: defaultSelect,
      orderBy: { createdAt: "desc" },
      skip: size * (page - 1),
      take: size,
    }),
  };
};
export const getUser = async (email: string) => {
  return prisma.user.findUnique({
    where: { email: email },
    select: defaultSelect,
  });
};

export const getUserPasswordDigest = async (email: string) => {
  let user = await prisma.user.findUnique({
    where: { email },
    select: defaultSelectSecure,
  });
  if (user == null)
    user = await prisma.user.findUnique({
      where: { phoneNumber: email },
      select: defaultSelectSecure,
    });
  const passwordDigest = user?.passwordDigest;
  // @ts-expect-error
  if (user) delete user.passwordDigest;
  return { user, passwordDigest };
};
export const getUserPasswordDigestByPhone = async (phoneNumber: string) => {
  const user = await prisma.user.findUnique({
    where: { phoneNumber },
  });

  const passwordDigest = user?.passwordDigest;
  // @ts-expect-error
  if (user) delete user.passwordDigest;
  return { user, passwordDigest };
};
export const getUserPasswordDigestById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return user?.passwordDigest;
};
export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: defaultSelect,
  });
};
export const getUserBySlackPostId = async (slackPostId: string) => {
  return prisma.user.findUnique({
    where: { slackPostId },
    select: { id: true },
  });
};
export const toggleUserAutpReply = async (id: string, autoReply: boolean) => {
  return await prisma.user.update({
    where: { id },
    data: {
      autoReply,
    },
    select: {
      id: true,
    },
  });
};

export const getUserDetailById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: defaultSelectDetail,
  });
};
export const getUserByEmail = async (email: string, id?: string) => {
  if (id)
    return prisma.user.findFirst({
      where: {
        email,
        id: {
          not: id,
        },
      },
      select: defaultSelect,
    });
  return prisma.user.findUnique({
    where: { email },
    select: defaultSelect,
  });
};
export const getUserByPhone = async (phoneNumber: string) => {
  return await prisma.user.findUnique({
    where: { phoneNumber },
    select: defaultSelect,
  });
};

export const deleteUserFromAdmin = async (id: string) => {
  return prisma.user.delete({
    where: { id },
  });
};
export const createUserFromAdmin = async (
  email: string,
  password: string,
  phoneNumber: string,
  firstName: string,
  lastName: string,
  role: UserRole,
  timeZone?: string
) => {
  const passwordDigest = await hash(password, saltRounds);
  return prisma.user.create({
    data: {
      email,
      phoneNumber,
      passwordDigest,
      role,
      emailVerified: new Date(),
      timeZone,
      profile: {
        create: {
          lastName,
          firstName,
        },
      },
    },
    select: defaultSelect,
  });
};
export const upsertUserFromBubble = async (bubbleUser: BubbleUser) => {
  const passwordDigest = await hash(bubbleUser.verifiedPhone, saltRounds);
  const profile: BubbleUserProfile = {
    accountabilitySetting: bubbleUser.accountabilitySetting,
    challenges: bubbleUser.challenges,
    currentRoutine: bubbleUser.currentRoutine,
    currentNutrition: bubbleUser.currentNutrition,
    fitnessGoals: bubbleUser.fitnessGoals,
    height: bubbleUser.height,
    weight: bubbleUser.weight,
    age: bubbleUser.age,
    preferredExercises: bubbleUser.preferredExercises,
    targetRoutine: bubbleUser.targetRoutine,
    wakeupTime: bubbleUser.wakeupTime,
    sleepTime: bubbleUser.sleepTime,
    userReady: bubbleUser.userReady,
  };
  //check email or phone number is registered to another user
  const userDataCreate = {
    phoneNumber: bubbleUser.verifiedPhone,
    email: bubbleUser.email,
    passwordDigest,
    timeZone: bubbleUser.timezone,
    bubbleId: bubbleUser.uniqueID,
    bubbleRole: bubbleUser.bubbleRole,
    phoneNumberVerified: new Date(),
    isActive: false,
    profile: {
      create: {
        firstName: bubbleUser.firstName,
        lastName: bubbleUser.lastName,
        profileData: profile,
      },
    },
  };

  const userDataUpdate = {
    phoneNumber: bubbleUser.verifiedPhone,
    email: bubbleUser.email,
    timeZone: bubbleUser.timezone,
    bubbleId: bubbleUser.uniqueID,
    bubbleRole: bubbleUser.bubbleRole,
    profile: {
      update: {
        firstName: bubbleUser.firstName,
        lastName: bubbleUser.lastName,
        profileData: profile,
      },
    },
  };

  const user = await prisma.user.upsert({
    where: {
      bubbleId: bubbleUser.uniqueID,
    },
    create: userDataCreate,
    update: userDataUpdate,
    select: {
      payer: true,
      id: true,
      phoneNumber: true,
      timeZone: true,
      profile: true,
    },
  });

  //Check is user ready to getting start with conversation
  if (user) {
    if (
      bubbleUser.stripeCurrentPeriodEnd &&
      bubbleUser.stripeCustomerId &&
      bubbleUser.stripeSubscriptionId &&
      bubbleUser.stripePriceId
    ) {
      const payer = {
        stripeCurrentPeriodEnd: bubbleUser.stripeCurrentPeriodEnd,
        stripeCustomerId: bubbleUser.stripeCustomerId,
        stripeSubscriptionId: bubbleUser.stripeSubscriptionId,
        stripePriceId: bubbleUser.stripePriceId,
      };

      if (
        user.payer.filter(
          (p) => p.stripeSubscriptionId === bubbleUser.stripeSubscriptionId
        ).length === 0
      ) {
        //if subscription id is new we should add to user's payer
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            payer: {
              create: payer,
            },
          },
        });
      } else {
        await prisma.payer.update({
          where: {
            stripeSubscriptionId: payer.stripeSubscriptionId,
          },
          data: payer,
        });
      }
    }
  }
  if (bubbleUser.userReady === true || bubbleUser.userReady === "true") {
    if (
      (await prisma.conversation.findFirst({ where: { userId: user.id } })) ===
      null
    ) {
      //make user active
      await setUserActive(user.id);
      await createConversationV2(user.id, convertJsonProfileToProfile(profile));
      await createNewSlackPostId(user.id);
    }
  }
  return { id: user.id };
};
export const setUserActive = async (userId: string) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isActive: true,
    },
  });
};
export const updateUser = async (
  id: string,
  firstName: string,
  lastName: string
) => {
  await prisma.profile.updateMany({
    where: {
      userId: id,
    },
    data: {
      firstName,
      lastName,
    },
  });
  return { success: true };
};
export const updateUserFromAdmin = async (
  id: string,
  email: string,
  password: string,
  phoneNumber: string,
  firstName: string,
  lastName: string,
  role: UserRole,
  timeZone?: string
) => {
  return prisma.user.update({
    where: {
      id: id,
    },
    data: {
      role,
      emailVerified: new Date(),
      passwordDigest: password ? await hash(password, saltRounds) : undefined,
      phoneNumber,
      email,
      timeZone,
      profile: {
        update: {
          lastName,
          firstName,
        },
      },
    },
    select: defaultSelect,
  });
};
export const createUser = async (
  email: string,
  password: string,
  phoneNumber: string,
  firstName: string,
  timeZone?: string
) => {
  const passwordDigest = await hash(password, saltRounds);
  return prisma.user.create({
    data: {
      email,
      phoneNumber,
      role: UserRole.USER,
      passwordDigest,
      emailVerified: new Date(),
      profile: {
        create: {
          firstName,
        },
      },
    },
    select: defaultSelect,
  });
};
export const compareUserPassword = async (userId: string, password: string) => {
  const userPassword = (await getUserPasswordDigestById(userId)) || "";
  return compare(password, userPassword);
};
export const checkEmailNotExists = async (email: string) => {
  return (await prisma.user.count({ where: { email } })) === 0;
};
export const checkPhoneNotExists = async (phoneNumber: string) => {
  return (await prisma.user.count({ where: { phoneNumber } })) === 0;
};
export const changeEmail = async ({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) => {
  await prisma.user.update({
    where: { id: userId },
    data: { email },
  });
  return {};
};
export const changePassword = async ({
  userId,
  password,
}: {
  userId: string;
  password: string;
}) => {
  const passwordDigest = await hash(password, saltRounds);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordDigest },
  });
  return { success: true };
};
export const createNewSlackPostId = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { phoneNumber: true, timeZone: true, profile: true },
  });

  const slackPostId = (
    await slackPostMessage({
      userId: id,
      username: user?.profile?.firstName + " " + user?.profile?.lastName,
      text: user?.phoneNumber + ", " + user?.timeZone,
    })
  ).ts;
  console.log(slackPostId);
  await prisma.user.update({
    where: { id },
    data: { slackPostId },
  });
  return { slackPostId };
};
