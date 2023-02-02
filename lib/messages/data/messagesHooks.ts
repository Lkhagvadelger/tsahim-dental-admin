import { useQuery, useMutation } from "react-query";
import { fetcher } from "@util/query";

// We should subset this to only interface we need.
export type MessageInputType = {
  conversationId: string;
  input: string;
  questionList: string;
  sendSMS?: boolean;
};
export const useCreateMessages = (conversationId: string) => {
  return useMutation((data: any) =>
    fetcher.post(`messages/${conversationId}`, data)
  );
};
export const useCreateManualMessages = (conversationId: string) => {
  return useMutation((data: any) =>
    fetcher.post(`messages/${conversationId}/manual`, data)
  );
};
export const useReplyMessages = (conversationId: string) => {
  return useMutation((data: any) =>
    fetcher.put(`messages/${conversationId}`, data)
  );
};

export const useMessagesByConversationId = (conversationId: string) => {
  return useQuery("messages", () =>
    fetcher.get(`conversation/${conversationId}/messages`)
  );
};
