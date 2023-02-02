import { prisma } from "@api/prisma";
import { QueryParamType } from "@ui/hooks/query-param";

const defaultSelect = {
  id: true,
  name: true,
  messages: true,
  prompt: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
};
const defaultSelectLess = {
  id: true,
  name: true,
  messages: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
};
export const getConversations = async () => {
  return await prisma.conversation.findMany({
    select: defaultSelect,
  });
};

export const getConversationsFilter = async (filter: QueryParamType) => {
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
        { userId: fText },
        { prompt: fText },
        { messages: fText },
        { name: fText },
      ],
    });
  }
  const where =
    filters.length === 0
      ? {}
      : filters.length === 1
      ? filters[0]
      : { AND: filters };
  const total = await prisma.conversation.count({ where });

  return {
    total,
    pages: Math.ceil(total / size),
    data: await prisma.conversation.findMany({
      where,
      select: defaultSelect,
      orderBy: { createdAt: "desc" },
      skip: size * (page - 1),
      take: size,
    }),
  };
};

export const getConversationById = async (id: string) => {
  return prisma.conversation.findUnique({
    where: {
      id,
    },
    select: defaultSelect,
  });
};
export const getConversationByUserId = async (userId: string) => {
  return prisma.conversation.findMany({
    where: {
      userId: userId,
    },
    select: defaultSelectLess,
  });
};
export const getNotFinishedConversationByUserId = async (userId: string) => {
  return prisma.conversation.findMany({
    where: {
      userId: userId,
      isFinished: false,
    },
    select: defaultSelect,
    orderBy: { createdAt: "desc" },
    take: 1,
  });
};
