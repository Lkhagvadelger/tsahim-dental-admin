import { withRequireLogin } from "@lib/auth/ui";
import { ChatPage } from "@lib/chat/ui/ChatPage";
import { useRouter } from "next/router";

const ChatIndex = () => {
  const router = useRouter();

  return <ChatPage conversationId={router.query.id as string} />;
};

export default withRequireLogin(ChatIndex);
