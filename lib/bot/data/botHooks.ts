import { useQuery, useMutation } from "react-query";
import { fetcher } from "@util/query";

// We should subset this to only interface we need.
import { User as PrismaUser } from "@prisma/client";
import { QueryParamType } from "@ui/hooks/query-param";
export type User = Pick<PrismaUser, "id" | "email" | "role">;
export type BotInputType = {
  id?: string;
  name: string;
  temperature: number;
  max_tokens: number;
  initialPrompt: string;
  summarizePrompt: string;
  finisherPrompt: string;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  best_of: number;
};
// Get list of all users
export const useBots = (filter: QueryParamType) => {
  return useQuery(
    ["botslist", filter.size, filter.page, filter.text],
    () => fetcher.post("bot/list", filter),
    { enabled: !!filter }
  );
};
export const useBotList = () => {
  return useQuery(["botlist"], () => fetcher.get("bot/list"), {
    enabled: true,
  });
};

export const useCreateBot = () => {
  return useMutation((data: any) => fetcher.post("bot", data));
};

export const useUpdateBot = () => {
  return useMutation((data: any) => fetcher.put(`bot/${data.id}`, data));
};
export const useDeleteBot = () => {
  return useMutation((data: any) => fetcher.delete(`bot/${data.id}}`, data));
};
