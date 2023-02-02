import {
  Flex,
  Box,
  DrawerContent,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  VStack,
  useDisclosure,
  useBreakpoint,
  Button,
  Icon,
} from "@chakra-ui/react";
import { ChangePasswordPage } from "@lib/profile/ui";
import { UserList } from "@lib/user/ui";
import React from "react";
import { ReactChild, ReactChildren } from "react";
import { BsArrowRight } from "react-icons/bs";
import { LeftConversation } from "./LeftConversation";

type Props = {
  selectedConversationId?: string;
  children: ReactChildren | ReactChild;
};

export const ChatUIContext = ({ selectedConversationId, children }: Props) => {
  const bp = useBreakpoint();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex h="100vh" flexDirection="column">
      <Flex flex="1" overflow="hidden" bg="#fff" color="gray.900" fontSize="sm">
        <LeftConversation selectedConversationId={selectedConversationId} />
        {selectedConversationId && (
          <Flex
            display={{
              base: "block",
              lg: "block",
            }}
            width={"full"}
            height={"full"}
            minW={96}
            direction="column"
            overflowY="auto"
            borderRightWidth="1px"
            borderColor={"gray.600"}
          >
            {children}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
