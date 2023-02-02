import { cleanGPTResult, createCompletion } from "@api/openai";
import { prisma } from "@api/prisma";
import { addBotToUser } from "@lib/bot/api/service";
import { createMessageV2 } from "@lib/messages/api/messageService";
import { QueryParamType } from "@ui/hooks/query-param";
import { getBotNameBasedOnTimeZone } from "@util/converter";
import { AppError } from "@util/errors";

const defaultSelect = {
  id: true,
  name: true,
  messages: true,
  prompt: true,
  userId: true,
  user: true,
  isFlagged: true,
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
export const createTagTemp = async (name: string) => {
  await prisma.tag.create({
    data: {
      name,
    },
  });
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
      OR: [{ userId: fText }, { prompt: fText }, { name: fText }],
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
      select: {
        id: true,
        name: true,
        userId: true,
        user: true,
        prompt: true,
        bot: { select: { name: true } },
        messages: {
          select: {
            id: true,
            gptResponse: true,
            userResponse: true,
            tokenUsage: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: size * (page - 1),
      take: size,
    }),
  };
};
export const getConversationSummary = async (conversationId: string) => {
  return { summary: "" };
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
  const conversation = await prisma.conversation.findMany({
    where: {
      userId: userId,
      isFinished: false,
    },
    select: defaultSelect,
    orderBy: { createdAt: "desc" },
    take: 1,
  });
  if (conversation.length > 0) return conversation[0];
  else return null;
};
//User must be already created
export const createConversationV2 = async (
  userId: string,
  profile: string,
  botId?: string,
  isFirstTime?: boolean
) => {
  //check user is exist by userId
  let user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      profile: true,
      timeZone: true,
      autoReply: true,
      slackPostId: true,
      phoneNumber: true,
    },
  });
  if (!user) throw AppError.BadRequest("user not found");
  if (!user.timeZone) throw AppError.BadRequest("user timezone not found");

  const startingBotName = await getBotNameBasedOnTimeZone(user.timeZone!);

  const initiatorBot = await prisma.bot.findFirst({
    where: { name: startingBotName },
  });
  if (!initiatorBot) throw AppError.BadRequest(`${startingBotName} not found`);

  const mainBot = botId
    ? await prisma.bot.findUnique({ where: { id: botId } })
    : await prisma.bot.findFirst({ where: { name: "Main bot" } });

  if (!mainBot) throw AppError.BadRequest("Main bot not found");

  const userName = user.profile?.firstName + "";

  const initialPrompt = initiatorBot.initialPrompt.replace(
    /{{name}}/g,
    userName
  );

  const initiatorGptMessage = await createCompletion({
    prompt: initialPrompt,
    settings: {
      temperature: parseFloat(initiatorBot.temperature.toString() + ""),
      max_tokens: parseFloat(initiatorBot.max_tokens + ""),
      top_p: parseFloat(initiatorBot.top_p + ""),
      frequency_penalty: parseFloat(initiatorBot.frequency_penalty + ""),
      presence_penalty: parseFloat(initiatorBot.presence_penalty + ""),
      best_of: parseFloat(initiatorBot.best_of + ""),
    },
  });

  if (!initiatorGptMessage)
    throw AppError.BadRequest(
      `${startingBotName} could not return initiatorMessage from completionQA function`
    );

  let prompt = mainBot.initialPrompt;
  prompt = prompt.replace(/{{name}}/g, userName);
  prompt = prompt.replace(/{{profile}}/g, profile);
  await addBotToUser(userId, initiatorBot.id);
  const id = (
    await prisma.conversation.create({
      data: {
        name: userName,
        prompt,
        userId,
        botId: mainBot.id,
      },
      select: { id: true },
    })
  ).id;
  //create new message model
  await createMessageV2(id, user, cleanGPTResult(initiatorGptMessage));
  //call openai completion
  //update message model
  return await getConversationById(id);
};
export const deleteConversation = async (id: string) => {
  return prisma.conversation.delete({
    where: {
      id,
    },
    select: { id: true },
  });
};
export const updateConversation = async (
  id: string,
  name: string,
  prompt: string
) => {
  return prisma.conversation.update({
    where: {
      id,
    },
    data: {
      name,
      prompt,
    },
    select: defaultSelect,
  });
};
