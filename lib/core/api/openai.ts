import { Configuration, OpenAIApi } from "openai";
import { useMutation } from "react-query";
import { fetcher } from "@util/query";
import { sendSlackMessage } from "./slack";
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);
const textDavinchi = "text-davinci-003";
export const createCompletionQA = async (
  prompt: string,
  userName: string,
  temperature: number = 0.1,
  max_tokens: number = 256,
  top_p: number = 1,
  frequency_penalty: number = 0,
  presence_penalty: number = 0,
  best_of: number = 1
) => {
  const response = await openai.createCompletion({
    model: textDavinchi,
    prompt,
    temperature,
    max_tokens,
    top_p,
    frequency_penalty,
    presence_penalty,
    best_of,
    stop: ["Retain:", userName + ":"],
  });
  return response.data;
};

export const createCompletion = async ({
  prompt,
  settings = {
    temperature: 0.1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    best_of: 1,
  },
}: {
  prompt: string;
  settings: {
    temperature: number;
    max_tokens: number;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;
    best_of: number;
  };
}) => {
  const response = await openai.createCompletion({
    model: textDavinchi,
    prompt,
    temperature: settings.temperature,
    max_tokens: settings.max_tokens,
    top_p: settings.top_p,
    frequency_penalty: settings.frequency_penalty,
    presence_penalty: settings.presence_penalty,
    best_of: settings.best_of,
  });

  return cleanGPTResult(response.data.choices[0].text);
};
export type ModerationResponse = {
  id: string;
  model: string;
  results: Array<{
    categories: {
      hate: boolean;
      "hate/threatening": boolean;
      "self-harm": boolean;
      sexual: boolean;
      "sexual/minors": boolean;
      violence: boolean;
      "violence/graphic": boolean;
    };
    category_scores: {
      hate: number;
      "hate/threatening": number;
      "self-harm": number;
      sexual: number;
      "sexual/minors": number;
      violence: number;
      "violence/graphic": number;
    };
    flagged: boolean;
  }>;
};

export const useModerationIsFlagged = async (
  isGptInput: boolean,
  input: string,
  conversationId: string
) => {
  const rawResponse = await fetch(`https://api.openai.com/v1/moderations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input }),
  });

  const result: ModerationResponse = await rawResponse.json();
  //Always send message when flagged messages detected
  if (result.results[0].flagged) {
    const conversationUrl = `Conversation link: <https://boss.retaingoals.com/chat/${conversationId}>`;
    const inputOwner = isGptInput ? "GPT Result" : "User Input";
    await sendSlackMessage(
      `#flagged-messages`,
      `VIOLATION OF AGREEMENT DETECTED!\nInput text: ${input}\nInput owner: ${inputOwner} \n${conversationUrl}`
    );
  }
  return result;
};
export const cleanGPTResult = (result?: string) => {
  if (result === undefined) return "";
  return result.trimStart().trimEnd().trim();
};
