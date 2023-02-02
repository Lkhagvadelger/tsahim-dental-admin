import {
  Avatar,
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  Tooltip,
} from "@chakra-ui/react";
import NextLink from "next/link";
import * as React from "react";
import { FaBullseye } from "react-icons/fa";
import TimeAgo from "react-timeago";

type ChatTileType = {
  id: string;
  name: string;
  userId: string;
  user: {
    phoneNumber: string;
  };
  prompt: string;
  bot: { name: string };
  messages: {
    id: string;
    gptResponse: string;
    userResponse: string;
    tokenUsage?: any;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
};

export const ChatUserTile = ({
  props,
  active,
}: {
  props: ChatTileType;
  active: boolean;
}) => {
  const message = props.messages[0];
  return (
    <NextLink href={"/chat/" + props.id}>
      <HStack
        w="full"
        px="3"
        py="2"
        cursor="pointer"
        userSelect="none"
        borderBottom={"1px"}
        borderColor={"gray.200"}
        transition="all 0.2s"
        bg={active ? "gray.300" : undefined}
        color={active ? "gray.600" : undefined}
        _hover={{ bg: "gray.400", color: "gray.800" }}
        _active={{ bg: "gray.200", color: "gray.600" }}
      >
        <VStack w="full">
          <HStack w="full">
            <Avatar
              borderWidth={1}
              borderRadius="50%"
              borderColor="white"
              size="sm"
              name={props.name}
              color="gray.900"
              fontWeight="bold"
              sx={{ "& > div": { fontSize: "0.625rem", color: "white" } }}
            />
            <VStack spacing={0} w={"full"}>
              <HStack w={"full"} gap={0}>
                <Text>{props.name} </Text>
                <Tooltip label="Current bot name">
                  <Badge
                    fontSize={"9"}
                    size={"xs"}
                    variant="solid"
                    colorScheme="purple"
                  >
                    {props.bot?.name}
                  </Badge>
                </Tooltip>
                <Tooltip label="Total used token of last GPT responce">
                  <Badge
                    fontSize={"9"}
                    size={"xs"}
                    variant="solid"
                    colorScheme="gray"
                  >
                    {message?.tokenUsage?.total_tokens}
                  </Badge>
                </Tooltip>
              </HStack>
              <HStack
                w={"full"}
                fontSize={12}
                lineHeight={4}
                color={"gray.600"}
                spacing={0}
              >
                <Text w={"full"}>{props.user.phoneNumber}</Text>
                <HStack w={"full"} justifyContent={"flex-end"}>
                  <Box>
                    <TimeAgo date={message?.createdAt} />
                  </Box>
                </HStack>
              </HStack>
            </VStack>
          </HStack>
          <Box w={"full"} fontSize={12} lineHeight={1.5} color={"gray.600"}>
            {message?.gptResponse && message?.gptResponse.length > 75
              ? message?.gptResponse.toString().substring(0, 75) + "..."
              : message?.gptResponse}
          </Box>
        </VStack>
      </HStack>
    </NextLink>
  );
};
