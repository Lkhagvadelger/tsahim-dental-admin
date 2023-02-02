import {
  VStack,
  useDisclosure,
  Button,
  toaster,
  Flex,
  forwardRef,
  Textarea,
  Text,
  Box,
  Card,
} from "@ui/index";
import { useEffect, useImperativeHandle, useState } from "react";
import { DataEntryModal } from "@ui/components/DataEntryModal";
import { RegisterInputType } from "@lib/auth/data/authHooks";
import { ConversationForm } from "./ConversationForm";
import { MessageInputType } from "@lib/messages/data/messagesHooks";
import { ConversationInputType } from "../data/conversationHooks";

const AddConversation = (
  {
    refresh,
  }: {
    refresh: () => void;
  },
  ref: any
) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [conversationData, setConversationData] = useState<
    ConversationInputType | undefined | null
  >();

  useImperativeHandle(ref, () => ({
    onOpenEdit: (data: ConversationInputType) => {
      setConversationData(data);
      onOpen();
    },
  }));

  const closeDialog = () => {
    setConversationData(null);
    onClose();
    refresh && refresh();
  };
  return (
    <DataEntryModal
      closeOnOverlayClick={true}
      isOpen={isOpen}
      onClose={() => {
        closeDialog();
      }}
      onOpen={onOpen}
      title={""}
      titleLabel={""}
    >
      <ConversationForm
        closeDialog={closeDialog}
        data={conversationData}
        refresh={refresh}
      />
    </DataEntryModal>
  );
};

export const AddConversationModal = forwardRef(AddConversation);
