import { useQuery, useMutation } from "react-query";
import { fetcher } from "@util/query";

// We should subset this to only interface we need.
import { User as PrismaUser } from "@prisma/client";
import { QueryParamType } from "@ui/hooks/query-param";
export type User = Pick<PrismaUser, "id" | "email" | "role">;
export type ConversationInputType = {
  id?: string;
  userId: string;
  botId?: string;
  profile?: string;
  prompt?: string;
};
// Get list of all users
export const useConversations = (filter: QueryParamType) => {
  return useQuery(
    ["userslist", filter.size, filter.page, filter.text],
    () => fetcher.post("conversation/list", filter),
    { enabled: !!filter }
  );
};

// Create a new user
export const useCreateConversation = () => {
  return useMutation((data: any) => fetcher.post(`conversation/v2`, data));
};
export const useConversationSummary = () => {
  return useMutation((data: any) =>
    fetcher.post(`conversation/${data.conversationId}/summary`, data)
  );
};
