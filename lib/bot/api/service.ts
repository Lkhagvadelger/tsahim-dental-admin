import {
  cleanGPTResult,
  createCompletion,
  useModerationIsFlagged,
} from "@api/openai";
import { prisma } from "@api/prisma";
import { getNotFinishedConversationByUserId } from "@lib/conversation/api/convoService";
import {
  getLatestMessageByConversationId,
  updateMessageTwilioSid,
} from "@lib/messages/api/messageService";
import { sendTwilioMessage } from "@lib/user/api/twilio";
import { QueryParamType } from "@ui/hooks/query-param";

const defaultSelect = {
  id: true,
  name: true,
  model: true,
  initialPrompt: true,
  summarizePrompt: true,
  finisherPrompt: true,
  temperature: true,
  max_tokens: true,
  top_p: true,
  best_of: true,
  frequency_penalty: true,
  presence_penalty: true,
  stopSequences: true,
  createdAt: true,
  updatedAt: true,
};
export const getBots = async () => {
  return await prisma.bot.findMany({
    select: defaultSelect,
    orderBy: { createdAt: "desc" },
  });
};
export const getBotsFilter = async (filter: QueryParamType) => {
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
        { name: fText },
        { initialPrompt: fText },
        { summarizePrompt: fText },
        { finisherPrompt: fText },
      ],
    });
  }
  const where =
    filters.length === 0
      ? {}
      : filters.length === 1
      ? filters[0]
      : { AND: filters };
  const total = await prisma.bot.count({ where });

  return {
    total,
    pages: Math.ceil(total / size),
    data: await prisma.bot.findMany({
      where,
      select: defaultSelect,
      orderBy: { createdAt: "desc" },
      skip: size * (page - 1),
      take: size,
    }),
  };
};

export const getBotById = async (id: string) => {
  return prisma.bot.findUnique({
    where: {
      id,
    },
    select: defaultSelect,
  });
};
export const getBotByName = async (name: string) => {
  return prisma.bot.findFirst({
    where: {
      name,
    },
    select: defaultSelect,
  });
};

export const createBot = async (
  name: string,
  initialPrompt: string,
  summarizePrompt: string,
  finisherPrompt: string,
  temperature: number,
  max_tokens: number,
  top_p: number,
  frequency_penalty: number,
  presence_penalty: number,
  best_of: number
) => {
  return await prisma.bot.create({
    data: {
      name,
      initialPrompt,
      summarizePrompt,
      finisherPrompt,
      temperature,
      max_tokens,
      top_p,
      frequency_penalty,
      presence_penalty,
      best_of,
    },
    select: { id: true },
  });
};
export const deleteBot = async (id: string) => {
  return await prisma.bot.delete({
    where: {
      id,
    },
    select: { id: true },
  });
};
export const updateBot = async (
  id: string,
  name: string,
  initialPrompt: string,
  summarizePrompt: string,
  finisherPrompt: string,
  temperature: number,
  max_tokens: number,
  top_p: number,
  frequency_penalty: number,
  presence_penalty: number,
  best_of: number
) => {
  return prisma.bot.update({
    where: {
      id,
    },
    data: {
      name,
      initialPrompt,
      summarizePrompt,
      finisherPrompt,
      temperature,
      max_tokens,
      top_p,
      frequency_penalty,
      presence_penalty,
      best_of,
    },
    select: defaultSelect,
  });
};
export const getBotByConversationId = async (conversationId: string) => {
  return await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
      bot: {
        select: {
          temperature: true,
          max_tokens: true,
          top_p: true,
          frequency_penalty: true,
          presence_penalty: true,
          best_of: true,
        },
      },
    },
  });
};
export const addBotToUser = async (userId: string, botId: string) => {
  return await prisma.userBots.create({
    data: { userId, botId },
    select: { id: true },
  });
};
export const IsTimeBasedFunctionAllowed = async () => {
  const isAllowed = await prisma.appConfiguration.findFirst({
    where: { name: "isTimeBasedFunctionAllowed" },
    select: { isActive: true },
  });
  if (isAllowed) return isAllowed.isActive;
  return true;
};
export const runDailyBot = async (
  botToRun: string,
  userId: string,
  userName: string,
  phoneNumber: string
) => {
  if (botToRun == "") return;
  const initiatorBot = await prisma.bot.findFirst({
    where: { name: botToRun },
  });

  if (!initiatorBot) return;

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
  if (!initiatorGptMessage) return;

  await addBotToUser(userId, initiatorBot.id);
  const conversation = await getNotFinishedConversationByUserId(userId);
  if (!conversation) return;

  const latestMessage = await getLatestMessageByConversationId(conversation.id);
  if (!latestMessage) return;
  //create new message model
  let moderation = await useModerationIsFlagged(
    true,
    initiatorGptMessage,
    conversation.id
  );
  // it is first message so input = prompt
  const newmessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      input: "",
      prompt: `${latestMessage.prompt}${latestMessage.gptResponse}\nRetain: `,
      gptResponse: cleanGPTResult(initiatorGptMessage),
      isGptFlagged: moderation.results[0].flagged,
      gptModeration: JSON.stringify(moderation),
    },
    select: {
      id: true,
    },
  });
  if (initiatorGptMessage) {
    //Send Question to user
    try {
      // Currently no need to be successfully delivered
      if (phoneNumber.charAt(0) == "+") {
        const twilioResult = await sendTwilioMessage(
          phoneNumber,
          initiatorGptMessage
        );

        await updateMessageTwilioSid(newmessage.id, twilioResult.sid);
      }
    } catch (ee) {}
  }
  return newmessage;
};
export const useDefenseBot = async (userInput: string) => {
  
  userInput.replace(/{{/g, userInput);
  userInput.replace(/}}/g, userInput);
  const bot = await prisma.bot.findFirst({
    where: { name: "Defense bot" },
  });
  if (!bot) return true;
  const initialPrompt = bot.initialPrompt.replace(/user_input/g, userInput);
  const gptMessage = await createCompletion({
    prompt: initialPrompt,
    settings: {
      temperature: parseFloat(bot.temperature.toString() + ""),
      max_tokens: parseFloat(bot.max_tokens + ""),
      top_p: parseFloat(bot.top_p + ""),
      frequency_penalty: parseFloat(bot.frequency_penalty + ""),
      presence_penalty: parseFloat(bot.presence_penalty + ""),
      best_of: parseFloat(bot.best_of + ""),
    },
  });
  console.log(gptMessage)
  if (gptMessage.toLocaleLowerCase() == "yes") return true;
  else return false;
};
