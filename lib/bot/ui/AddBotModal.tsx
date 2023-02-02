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
import { BotForm } from "./BotForm";
import { MessageInputType } from "@lib/messages/data/messagesHooks";
import { BotInputType } from "../data/botHooks";

const AddBot = (
  {
    refresh,
  }: {
    refresh: () => void;
  },
  ref: any
) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [botData, setBotData] = useState<BotInputType | undefined | null>();

  useImperativeHandle(ref, () => ({
    onOpenEdit: (data: BotInputType) => {
      setBotData(data);
      onOpen();
    },
  }));

  const closeDialog = () => {
    setBotData(null);
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
      <BotForm closeDialog={closeDialog} data={botData} refresh={refresh} />
    </DataEntryModal>
  );
};

export const AddBotModal = forwardRef(AddBot);
