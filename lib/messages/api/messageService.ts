import {
  cleanGPTResult,
  createCompletionQA,
  ModerationResponse,
  useModerationIsFlagged,
} from "@api/openai";
import { prisma } from "@api/prisma";

import { getBotByConversationId, useDefenseBot } from "@lib/bot/api/service";
import {
  getConversationById,
  getNotFinishedConversationByUserId,
} from "@lib/conversation/api/convoService";
import {
  cancelSubscription,
  disabelUserAccount,
  toggleUserAutpReply,
  getUserById,
  getUserByPhone,
  getUserBySlackPostId,
} from "@lib/user/api/userService";
import { sendTwilioMessage } from "@lib/user/api/twilio";
import { userPromptFilterAndModification } from "@lib/user/data/validators";
import { User } from "@prisma/client";
import { AppError, ERROR_MESSAGES } from "@util/errors";
import { LastMonthPage } from "twilio/lib/rest/api/v2010/account/usage/record/lastMonth";
import { sendSlackMessage, slackPostMessage } from "@api/slack";
const retainName = "Retain: ";
const defaultSelect = {
  id: true,
  conversationId: true,
  prompt: true,
  gptResponse: true,
  isGptFlagged: true,
  userResponse: true,
  userData: true,
  shouldFinish: true,
  createdAt: true,
  updatedAt: true,
};
const defaultSelectLess = {
  id: true,
  conversationId: true,
  gptResponse: true,
  userResponse: true,
  createdAt: true,
  updatedAt: true,
};
export const getMessages = async () => {
  return prisma.message.findMany({
    select: defaultSelect,
  });
};
export const getMessagesByBubbleId = async (bubbleId: string) => {
  return await prisma.message.findMany({
    where: {
      conversation: {
        user: {
          bubbleId,
        },
      },
    },
    select: defaultSelectLess,
    orderBy: { createdAt: "asc" },
  });
};
export const getMessagesByUserId = async (userId: string) => {
  return await prisma.message.findMany({
    where: {
      conversation: {
        userId,
      },
    },
    select: defaultSelectLess,
    orderBy: { createdAt: "asc" },
  });
};
export const getMessageByIdByConversationIdByUserId = async (
  id: string,
  conversationId: string,
  userId: string
) => {
  return prisma.message.findFirst({
    where: {
      id,
      conversationId,
      conversation: {
        userId,
      },
    },
    select: defaultSelect,
  });
};
export const getMessageById = async (id: string) => {
  return prisma.message.findUnique({
    where: {
      id,
    },
    select: defaultSelect,
  });
};
export const getLatestMessageByConversationId = async (
  conversationId: string
) => {
  return await prisma.message.findFirst({
    where: { conversationId },
    select: {
      ...defaultSelect,
      conversation: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 1,
  });
};
export const getMessagesByConversationId = async (conversationId: string) => {
  return await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
      messages: {
        orderBy: { createdAt: "asc" },
        select: defaultSelect,
      },
      name: true,
      userId: true,
      user: true,
      createdAt: true,
      prompt: true,
    },
  });
};
export const createSlackManualMessage = async (
  slackPostId: string,
  manualInput: string
) => {
  //find user by slackPostId
  const user = await getUserBySlackPostId(slackPostId);

  if (user == null) return;
  if (manualInput === "AUTO_REPLY_ON") {
    await toggleUserAutpReply(user.id, true);
    return;
  }
  //find conversation by userId
  const conversation = await getNotFinishedConversationByUserId(user.id);
  if (conversation == null) return;
  const sendToSlack = false;
  const sendSMS = true;
  await createManualMessage(
    conversation?.id,
    manualInput,
    sendSMS,
    sendToSlack
  );
};
export const createManualMessage = async (
  conversationId: string,
  manualInput: string,
  sendSMS: boolean,
  sendToSlack?: boolean
) => {
  const conversation = await getConversationById(conversationId);
  if (conversation == null)
    throw new AppError(
      400,
      ERROR_MESSAGES.BAD_REQUEST,
      "conversation not found by id"
    );
  const user = await getUserById(conversation.userId);
  if (user == null)
    throw new AppError(400, ERROR_MESSAGES.BAD_REQUEST, "user not found");

  await toggleUserAutpReply(user.id, false);
  if (sendToSlack === false) user.slackPostId = null;
  const message = await createMessageV2(conversationId, user, "", manualInput);

  //should send to users phone number
  if (sendSMS)
    message &&
      message.gptResponse &&
      user.phoneNumber.charAt(0) === "+" &&
      (await sendTwilioMessage(user.phoneNumber, message.gptResponse));
};
// {initiatorMessage} is result of initiatorBot Message initiator bot must run before this function
export const createMessageV2 = async (
  conversationId: string,
  user: Pick<
    User,
    "id" | "phoneNumber" | "slackPostId" | "timeZone" | "autoReply"
  > & {
    profile: any;
  },
  initiatorGptMessage: string,
  manualResponse?: string
) => {
  const latestMessage = await getLatestMessageByConversationId(conversationId);
  if (!manualResponse) manualResponse = "";
  if (latestMessage === null) {
    const conversation = await getMessagesByConversationId(conversationId);
    //this  will only happen when user is first time
    let moderation = await useModerationIsFlagged(
      true,
      initiatorGptMessage,
      conversationId
    );
    // it is first message so input = prompt
    const newmessage = await prisma.message.create({
      data: {
        conversationId,
        input: "",
        prompt: `${conversation?.prompt}\n${retainName}`,
        gptResponse: initiatorGptMessage,
        isGptFlagged: moderation.results[0].flagged,
        gptModeration: JSON.stringify(moderation),
      },
      select: {
        ...defaultSelect,
        conversation: { select: { name: true, userId: true } },
      },
    });
    if (initiatorGptMessage) {
      //Send Question to user
      try {
        user.slackPostId &&
          (await slackPostMessage({
            text: initiatorGptMessage,
            userId: user.id,
            username: "RetainBoss",
            thread_ts: user.slackPostId,
          }));

        // Currently no need to be successfully delivered
        if (user.phoneNumber.charAt(0) == "+") {
          const twilioResult = await sendTwilioMessage(
            user.phoneNumber,
            initiatorGptMessage
          );

          await updateMessageTwilioSid(newmessage.id, twilioResult.sid);
        }
      } catch (ee) {}
    }
    return newmessage;
  } else {
    const conversationBot = await getBotByConversationId(conversationId);

    const prompt = latestMessage.userResponse
      ? `${latestMessage.prompt}${latestMessage.gptResponse}\n${
          user.profile.firstName
        }: ${userPromptFilterAndModification(
          latestMessage.userResponse
        )}\n${retainName}`
      : `${latestMessage.prompt}${latestMessage.gptResponse}\n${retainName}`;

    const id = (
      await prisma.message.create({
        data: {
          conversationId,
          input: "",
          prompt,
        },
        select: { id: true },
      })
    ).id;
    let replyText = "";
    let tokenUsage: any = {};
    // if user is not set to auto reply then use manual response
    if (user.autoReply === null || user.autoReply === undefined)
      user.autoReply = true;

    if (user.autoReply === true && manualResponse.length === 0) {
      // call openai completion
      const completionResult = await createCompletionQA(
        prompt,
        user.profile.firstName,
        parseFloat(conversationBot?.bot?.temperature + ""),
        parseFloat(conversationBot?.bot?.max_tokens + "")
      );
      replyText = cleanGPTResult(completionResult?.choices[0]?.text);
      tokenUsage = completionResult?.usage;
    } else {
      replyText = manualResponse || "";
    }
    if (replyText.length > 0) {
      //add Moderation checker here
      let moderation = await useModerationIsFlagged(
        true,
        replyText,
        conversationId
      );
      user.slackPostId &&
        (await slackPostMessage({
          text: replyText,
          userId: user.id,
          username: "RetainBoss",
          thread_ts: user.slackPostId,
        }));
      await updateMessageGptResponse(id, replyText, moderation, tokenUsage);
    }
    return await getMessageById(id);
  }
};
export const createMessageViolated = async (
  conversationId: string,
  input: string,
  user: Pick<User, "id" | "phoneNumber" | "timeZone"> & { profile: any },
  violationMessage: string
) => {
  // it is first message so input = prompt
  const newmessage = await prisma.message.create({
    data: {
      conversationId,
      input,
      prompt: input,
      gptResponse: violationMessage,
    },
    select: {
      ...defaultSelect,
      conversation: { select: { name: true, userId: true } },
    },
  });

  return newmessage;
};
export const userSMSReplyOfMessageV2 = async (smsBody: any, from: string) => {
  const user = await getUserByPhone(from);
  if (!user) {
    //this user is never registered so we should return register link to new user
    await sendTwilioMessage(
      from,
      "Thank you for your interest in our service. Please register using this link: https://retaingoals.com"
    );
    //Register link full text and register link
    return;
  }
  if (user.isActive == false) {
    await sendSlackMessage(
      "#flagged-messages",
      `Disabled User: ${from}\nText: ${smsBody}`
    );
    return;
  }

  const conversation =
    user && (await getNotFinishedConversationByUserId(user.id));
  if (conversation) {
    //OpenAi Moderation checking hate speech and profanity
    const moderation = await useModerationIsFlagged(
      false,
      smsBody,
      conversation.id
    );
    user.slackPostId &&
    (await slackPostMessage({
      text: smsBody,
      userId: user.id,
      username: user.profile?.firstName + "",
      thread_ts: user.slackPostId,
    }));
    await updateMessageUserResponse(
      conversation.id,
      moderation,
      smsBody,
      user.profile?.firstName
    );

    const isFlagged = moderation.results[0].flagged;

    if (isFlagged == false) {
      // if not flagged then continue messages
      if (user.autoReply == null || user.autoReply == undefined)
        user.autoReply = true;

      if (user.autoReply) {
        const message = await createMessageV2(conversation.id, user, "");

        if (message && message.gptResponse) {
          
          if (user.phoneNumber.charAt(0) == "+") {
            const twilioResult = await sendTwilioMessage(
              from,
              message.gptResponse
            );

            await updateMessageTwilioSid(message.id, twilioResult.sid);
          }

          // response.message(newConversationMessage?.gptResponse);
          // return res.sendSuccess(response);
        }
      }
    } else {
      // send user terms violation message
      await sendTwilioMessage(
        from,
        "Your account is disabled due to violation. If you think this is a mistake please contact us via website chat support."
      );
      // disable user account
      await disabelUserAccount(conversation.userId, "input text violation");
      // cancel subscription if any
      await cancelSubscription(conversation.userId);
      // send chat to retain slack
      await sendSlackMessage(
        "#flagged-messages",
        `User ${conversation.user.phoneNumber} is disabled due to violation`
      );
      // send email to user
    }
  }
};
export const userSMSReplyOfWebService = async (
  conversationId: string,
  input: string
) => {
  const conversation = await getConversationById(conversationId);
  if (conversation == null)
    throw new AppError(
      400,
      ERROR_MESSAGES.BAD_REQUEST,
      "conversation not found by id"
    );
  const user = await getUserById(conversation.userId);
  if (user == null)
    throw new AppError(400, ERROR_MESSAGES.BAD_REQUEST, "user not found");

  if (user.isActive == false) {
    const a = await sendSlackMessage(
      "#flagged-messages",
      `Disabled User: ${user.phoneNumber}\nText: ${input}`
    );
    throw new AppError(
      400,
      ERROR_MESSAGES.BAD_REQUEST,
      "disabled user trying to send message"
    );
  }
  // decide new conversation or existing conversation

  if (conversation) {
    //OpenAi Moderation checking hate speech and profanity
    const moderation = await useModerationIsFlagged(
      false,
      input,
      conversation.id
    );
    user.slackPostId &&
      (await slackPostMessage({
        text: input,
        userId: user.id,
        username: user.profile?.firstName + "",
        thread_ts: user.slackPostId,
      }));
    await updateMessageUserResponse(
      conversation.id,
      moderation,
      input,
      user.profile?.firstName
    );

    const isFlagged = moderation.results[0].flagged;

    if (isFlagged == false) {
      if (user.autoReply == null || user.autoReply == undefined)
        user.autoReply = true;

      if (user.autoReply) {
        // if not flagged then continue messages
        await createMessageV2(conversation.id, user, "");
      }
    } else {
      // send user terms violation message
      await createMessageViolated(
        conversation.id,
        input,
        user,
        "Your account is disabled due to violation. If you think this is a mistake please contact us via website chat support."
      );
      // disable user account
      await disabelUserAccount(conversation.userId, "input text violation");
      // cancel subscription if any
      await cancelSubscription(conversation.userId);
      // send chat to retain slack
      await sendSlackMessage(
        "#flagged-messages",
        `User ${conversation.user.phoneNumber} is disabled due to violation`
      );
      // send email to user
    }
  }
  return {};
};
export const deleteMessage = async (id: string) => {
  return prisma.message.delete({
    where: {
      id,
    },
    select: { id: true },
  });
};
export const updateMessageGptResponse = async (
  id: string,
  gptResponse: string,
  moderation: ModerationResponse,
  tokenUsage: any,
  isManualResponse?: boolean
) => {
  return prisma.message.update({
    where: {
      id,
    },
    data: {
      gptResponse,
      isGptFlagged: moderation.results[0].flagged,
      gptModeration: JSON.stringify(moderation),
      tokenUsage,
    },
    select: defaultSelect,
  });
};
export const getFullConversationOnly = async (conversationId: string) => {
  const allMessage = await getMessagesByConversationId(conversationId);

  let allMessageText = "";
  allMessage!.messages.forEach((message) => {
    allMessageText +=
      message.gptResponse != null && message.userResponse != null
        ? message.gptResponse + "\n" + message.userResponse + "\n"
        : "";
  });
  return allMessageText;
};
export const getConversationLatestFullPrompt = async (
  conversationId: string
) => {
  const allMessage = await getMessagesByConversationId(conversationId);
  const latestMessage = allMessage?.messages[allMessage.messages.length - 1];
  if (latestMessage)
    return (
      latestMessage.prompt +
      latestMessage.gptResponse +
      (latestMessage.userResponse ? latestMessage.userResponse : "")
    );
  return "";
};
export const updateMessageUserResponse = async (
  conversationId: string,
  userModeration: ModerationResponse,
  userResponse: string,
  firstName: string | undefined
) => {
  const latestMessage = await prisma.message.findFirst({
    where: { conversationId },
    select: {
      ...defaultSelect,
      conversation: {
        select: { bot: true, name: true, userId: true, isFlagged: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 1,
  });

  if (latestMessage === null) return { id: conversationId };
  let userData: string | undefined = "";
  let shouldFinish: boolean | undefined | null;
  // If user replied previous conversation then we need to create new conversation with old values

  if (
    latestMessage.userResponse != null &&
    latestMessage.userResponse.length > 0
  ) {
    // prompt is designed to add retain name at the end of prompt
    // so we need to remove it from prompt
    // add user response to prompt
    let lastIndex = latestMessage.prompt.lastIndexOf(retainName);
    // after removing last name from prompt, the prompt must be ended with new line(\n)
    const newPrompt =
      latestMessage.prompt.slice(0, lastIndex) +
      latestMessage.prompt.slice(lastIndex + retainName.length) +
      firstName +
      ": " +
      latestMessage.userResponse +
      //expecting Retain will answer
      "\n" +
      retainName;

    return await prisma.message.create({
      data: {
        conversationId: latestMessage.conversationId,
        prompt: newPrompt,
        input: "",
        gptResponse: "",
        gptModeration: "",
        isGptFlagged: false,
        userResponse,
        userData,
        isUserFlagged: userModeration.results[0].flagged,
        userModeration: JSON.stringify(userModeration),
        shouldFinish,
      },
      select: { id: true },
    });
  } else {
    return await prisma.message.update({
      where: {
        id: latestMessage.id,
      },
      data: {
        userResponse,
        userData,
        isUserFlagged: userModeration.results[0].flagged,
        userModeration: JSON.stringify(userModeration),
        shouldFinish,
      },
      select: { id: true },
    });
  }
};
export const updateMessageDeliveryStatus = async (id: string) => {
  await prisma.message.update({
    where: { id },
    data: { isDeliveredToUser: new Date() },
  });
};
export const updateMessageTwilioSid = async (id: string, smsSid: string) => {
  await prisma.message.update({
    where: { id },
    data: { smsSid },
  });
};
export const getMessageBySmsSid = async (smsSid: string) => {
  return prisma.message.findFirst({
    where: {
      smsSid,
    },
    select: defaultSelect,
  });
};
type TwilioStatus = {
  SmsSid: string;
  SmsStatus: string;
  MessageStatus: string;
  To: string;
  MessageSid: string;
  AccountSid: string;
  From: string;
  ApiVersion: string;
};
type _SMS_Result = {
  sid: string;
  status?: any[]; //_SMS_Result_Status
};
export const getMessageDeliveryCallback = async (item: TwilioStatus) => {
  const message = await getMessageBySmsSid(item.SmsSid);

  if (item.SmsStatus == "delivered" && message)
    await updateMessageDeliveryStatus(message.id);
};
