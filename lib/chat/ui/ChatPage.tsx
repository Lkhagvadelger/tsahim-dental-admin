import { Box } from "@chakra-ui/react";
import { AdminProvider } from "@lib/admin/ui/layout/AdminUIContext";
import { useAuth } from "@lib/auth/ui";
import { ChatUIContext } from "@lib/chat/ui/ChatUIContext";
import { RightMesseageList } from "@lib/chat/ui/RightMesseageList";
import { UserRole } from "@prisma/client";
import NotFoundPage from "pages/404";

export const ChatPage = ({ conversationId }: { conversationId?: string }) => {
  const { user } = useAuth();

  return !user || user.role != UserRole.ADMIN ? (
    <NotFoundPage />
  ) : (
    <AdminProvider selectedNav="chat">
      <ChatUIContext selectedConversationId={conversationId}>
        <>
          {conversationId ? (
            <RightMesseageList
              key={conversationId}
              selectedConversationId={conversationId}
            />
          ) : (
            <Box>Pleaase select conversationId</Box>
          )}
        </>
      </ChatUIContext>
    </AdminProvider>
  );
};
