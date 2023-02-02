import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  ConversationInputType,
  useConversations,
} from "@lib/conversation/data/conversationHooks";
import { AddConversationModal } from "@lib/conversation/ui/AddConversationModal";
import { ChatUserTile } from "@lib/user/ui/ChatUserTile";
import { useQueryParam } from "@ui/hooks/query-param";
import { useEffect, useRef, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";

export const LeftConversation = ({
  selectedConversationId,
}: {
  selectedConversationId?: string;
}) => {
  const w = "72";
  const { params, setParam } = useQueryParam({
    size: "10",
    page: "1",
    text: "",
  });

  const [messages, setMessages] = useState<any[]>([]);
  const { data, refetch, isLoading } = useConversations(params);

  useEffect(() => {
    if (data && data.data) {
      setMessages(data.data);
    }
  }, [data]);

  const loadNextPage = () => {
    setParam("page", (parseInt(params.page) + 1).toString());
  };
  const loadPrevPage = () => {
    setParam("page", (parseInt(params.page) - 1).toString());
  };
  const createConversationModalRef = useRef() as {
    current: {
      onOpenEdit: (data: ConversationInputType | undefined | null) => void;
    };
  };
  const openNewConversationModal = () => {
    createConversationModalRef?.current?.onOpenEdit(null);
  };
  const containerRef = useRef(null);
  const handleScroll = (event: any) => {
    const container = event.target;
    if (
      container.scrollTop + container.offsetHeight ===
      container.scrollHeight
    ) {
      console.log("end off chat list");
    }
  };
  return (
    <Flex
      h="full"
      minW={{ base: "full", md: w, lg: w }}
      w={{ base: w, lg: w, md: w }}
      direction="column"
      borderRight={{ base: "0px", md: "1px" }}
      borderColor={"gray.200"}
    >
      <Stack
        spacing="0"
        flex="1"
        overflow="auto"
        pt="0"
        ref={containerRef}
        onScroll={handleScroll}
      >
        <VStack p="3" borderBottom={"1px"} w={"full"}>
          <Text w={"full"} fontWeight={700}>
            Messages
          </Text>
          <HStack spacing={3} w={"full"}>
            {/* <FormControl w={"full"} id="search">
              <InputGroup size="sm">
                <FormLabel srOnly>Search</FormLabel>
                <InputLeftElement pointerEvents="none" color="gray.400">
                  <BsSearch />
                </InputLeftElement>
                <Input
                  pl={7}
                  rounded="base"
                  type="search"
                  placeholder="Search..."
                />
              </InputGroup>
            </FormControl> */}
            <AddConversationModal
              ref={createConversationModalRef}
              refresh={refetch}
            />

            <Button
              size={"sm"}
              onClick={openNewConversationModal}
              w={"full"}
              variant={"default"}
            >
              <Icon as={BsPencilSquare} /> <Text pl={2}>Start new chat</Text>
            </Button>
          </HStack>
        </VStack>
        {isLoading && (
          <Stack>
            <Box padding="6" boxShadow="lg" bg="white">
              <SkeletonCircle size="10" />
              <SkeletonText
                mt="4"
                noOfLines={4}
                spacing="4"
                skeletonHeight="2"
              />
            </Box>
          </Stack>
        )}
        {messages &&
          messages.map((item: any, i: number) => {
            if (item && item.messages && item.messages.length > 0)
              return (
                <ChatUserTile
                  key={i}
                  props={item}
                  active={item.id === selectedConversationId}
                />
              );
          })}

        <Flex justifyContent={"center"}>
          <Button variant={"outline"} m={2} size="sm" onClick={loadPrevPage}>
            Prev
          </Button>
          <Button variant={"outline"} m={2} size="sm" onClick={loadNextPage}>
            Next
          </Button>
        </Flex>
      </Stack>
    </Flex>
  );
};
