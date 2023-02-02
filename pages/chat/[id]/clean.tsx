import { Box, Textarea } from "@chakra-ui/react";
import { withRequireLogin } from "@lib/auth/ui";
import { ChatPage } from "@lib/chat/ui/ChatPage";
import { useMessagesByConversationId } from "@lib/messages/data/messagesHooks";
import { useRouter } from "next/router";

const ChatClean = () => {
  const router = useRouter();
  const { data, isLoading, isFetched, refetch } = useMessagesByConversationId(
    router.query.id as string
  );
  let messages = data?.messages[data?.messages.length - 1].prompt+ data?.messages[data?.messages.length - 1].gptResponse;
  return (
    <Box w="full" h="full">
      <Textarea
        w="full"
        h="full"
        rows={50}
        type="text"
        value={messages}
      ></Textarea>
    </Box>
  );
};

export default withRequireLogin(ChatClean);
