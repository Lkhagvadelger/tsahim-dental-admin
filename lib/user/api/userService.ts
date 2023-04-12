import { prisma } from "@api/prisma";
import { QueryParamType } from "@ui/hooks/query-param";
import { compare, hash } from "bcryptjs";

const saltRounds = 10;

const defaultSelectSecure = {
  id: true,
  email: true,
  emailVerified: true,
  phoneNumber: true,
  phoneNumberVerified: true,
  updatedAt: true,
  createdAt: true,
  passwordDigest: true,
};
const defaultSelect = {
  id: true,
  email: true,
  emailVerified: true,
  phoneNumber: true,
  phoneNumberVerified: true,
  isActive: true,
  timeZone: true,
  autoReply: true,
  slackPostId: true,
  updatedAt: true,
  createdAt: true,
  passwordDigest: false,
};
const defaultSelectDetail = {
  id: true,
  email: true,
  emailVerified: true,
  phoneNumber: true,
  phoneNumberVerified: true,
  isActive: true,
  timeZone: true,
  updatedAt: true,
  createdAt: true,
  passwordDigest: false,
  userBots: true,
  conversation: true,
};

export const getUsers = async () => {
  return prisma.user.findMany({
    select: defaultSelect,
  });
};

export const cancelSubscription = async (userId: string) => {
  return;
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
        { firstName: fText },
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
