import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  HStack,
  InputGroup,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  MessageInputType,
  useCreateManualMessages,
  useMessagesByConversationId,
  useReplyMessages,
} from "@lib/messages/data/messagesHooks";
import { useUpdateAutoReply } from "@lib/user/data/userHooks";
import { toaster } from "@ui/index";
import { displayTimeByTimeZone } from "@util/converter";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsThreeDots } from "react-icons/bs";
import { IoSendOutline } from "react-icons/io5";
import { FriendMessage } from "./FriendMessage";
import { MyMessage } from "./MyMessage";

export const RightMesseageList = ({
  selectedConversationId,
}: {
  selectedConversationId: string;
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<MessageInputType>({
    defaultValues: {
      conversationId: selectedConversationId,
      sendSMS: false,
      questionList: "",
    },
  });
  watch("questionList");
  const { data, isLoading, isFetched, refetch } = useMessagesByConversationId(
    selectedConversationId
  );
  let questionNum = -1;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [autoReply, setAutoReply] = useState<boolean>(false);
  useEffect(() => {
    if (data?.user?.autoReply) {
      setAutoReply(data?.user?.autoReply);
    }
  }, [data]);
  const replayMessageMutation = useReplyMessages(selectedConversationId);
  const createManualMessage = useCreateManualMessages(selectedConversationId);
  const updateAutoReply = useUpdateAutoReply();

  const updateAutoReplyAction = async (check: boolean) => {
    updateAutoReply.mutate(
      {
        id: data.user.id,
        autoReply: check,
      },
      {
        onSuccess: (result) => {
          toaster.success("User auto reply changed");
          setAutoReply(!autoReply);
        },
        onError: (error: any) => {
          toaster.error(error.translationKey + "");
        },
      }
    );
  };

  const runQuestionList = async () => {
    if (getValues("questionList").split("\n").length == 0) {
      questionNum = -1;
    } else {
      questionNum = 0;
      setValue("input", getValues("questionList").split("\n")[0]);
      await userReplyAction();
    }
    onClose();
  };
  const createManualMessageAction = async () => {
    if (getValues("input") == "") {
      toaster.error("Please enter message");
      return;
    }
    setValue("sendSMS", true);
    createManualMessage.mutate(
      {
        ...getValues(),
      },
      {
        onSuccess: (result) => {
          refetch();
          setValue("input", "");
          setAutoReply(false);
          document.getElementById("bottomFocus")?.focus();
          toaster.success("Replied");
        },
        onError: (error: any) => {
          setValue("input", "");
          toaster.error(error.translationKey + "");
        },
      }
    );
  };
  const userReplyAction = async () => {
    if (getValues("input") == "") {
      toaster.error("Please enter message");
      return;
    }
    replayMessageMutation.mutate(
      {
        ...getValues(),
      },
      {
        onSuccess: (result) => {
          refetch();
          if (
            getValues("questionList") &&
            getValues("questionList").split("\n").length > 0 &&
            getValues("questionList").split("\n").length > questionNum + 1
          ) {
            questionNum++;

            toaster.success(
              `${questionNum}/${getValues("questionList").split("\n").length}`
            );

            setValue(
              "input",
              getValues("questionList").split("\n")[questionNum]
            );

            userReplyAction();
          } else {
            setValue("questionList", "");
            questionNum = -1;
            setValue("input", "");
            document.getElementById("bottomFocus")?.focus();
            toaster.success("Replied");
          }
        },
        onError: (error: any) => {
          setValue("input", "");
          toaster.error(error.translationKey + "");
        },
      }
    );
  };

  const inputAction = async (isCustomer: boolean) => {
    if (isCustomer) {
      userReplyAction();
    } else {
      createManualMessageAction();
    }
  };

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {data && (
        <Flex h="full" w="full" direction="column" borderColor={"gray.600"}>
          <Stack spacing="0" flex="1" overflow="auto" w={"full"}>
            <HStack borderBottom={"1px"} p={3} w={"full"}>
              <VStack alignContent={""} w={"full"}>
                <Text w={"full"} lineHeight={1}>
                  {data.name} 📱 {data.user.phoneNumber}
                </Text>
                <Text w={"full"} lineHeight={1}>
                  🗺 {data.user.timeZone} ⏰{" "}
                  {displayTimeByTimeZone(data.user.timeZone)}
                </Text>
              </VStack>
              <Box>
                <Button
                  variant={autoReply ? "default" : "delete"}
                  onClick={() => updateAutoReplyAction(!autoReply)}
                >
                  Auto reply is {autoReply ? "ON" : "OFF"}
                </Button>
              </Box>
              <HStack w={"12"} spacing={3} flexDir={"row-reverse"}>
                <Menu>
                  <MenuButton
                    ml={2}
                    pr={2}
                    pl={3}
                    rounded={"3xl"}
                    as={Button}
                    variant={"oulined"}
                    border={"1px"}
                  >
                    <BsThreeDots />
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        window.open(
                          `/api/conversation/${selectedConversationId}`,
                          "_blank"
                        );
                      }}
                    >
                      Json raw Data
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        window.open(
                          `/chat/${selectedConversationId}/clean`,
                          "_blank"
                        );
                      }}
                    >
                      Clean prompt
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        window.open(
                          `/chat/${selectedConversationId}/clean`,
                          "_blank"
                        );
                      }}
                    >
                      User detail
                    </MenuItem>
                    <MenuItem onClick={onOpen}>Add Question list</MenuItem>
                  </MenuList>
                </Menu>
                {/* <Tag
                  size={"md"}
                  borderRadius="full"
                  variant="solid"
                  colorScheme="blue"
                >
                  <TagLabel>Onboarding</TagLabel>
                  <TagCloseButton />
                </Tag>
                <Tag
                  size={"md"}
                  borderRadius="full"
                  variant="solid"
                  colorScheme="blue"
                >
                  <TagLabel>Fintess</TagLabel>
                  <TagCloseButton />
                </Tag>
                <Tag
                  size={"md"}
                  borderRadius="full"
                  variant="solid"
                  colorScheme="green"
                >
                  <TagLabel>Subscribed</TagLabel>
                  <TagCloseButton />
                </Tag> */}
              </HStack>
            </HStack>
            <VStack
              overflow={"auto"}
              spacing={2}
              h={"full"}
              borderColor={"gray.600"}
              p={3}
              bg="gray.50"
            >
              {data.messages.map((item: any, i: number) => {
                return (
                  <Box key={i} w={"full"}>
                    {item.gptResponse && (
                      <FriendMessage
                        name={"GPT 3"}
                        text={item.gptResponse}
                        createdDate={item.createdAt}
                      />
                    )}
                    {item.userResponse && (
                      <MyMessage name={data.name} data={item} />
                    )}
                  </Box>
                );
              })}
              <input id="bottomFocus" style={{ display: "none" }}></input>
            </VStack>
            <Flex
              minH="36"
              maxH="36"
              h="36"
              w="full"
              direction="column"
              overflow="auto"
              bg="gray.50"
            >
              <VStack p="3" w={"full"} alignItems={"end"}>
                <FormControl w={"full"}>
                  <InputGroup size="sm" w={"full"}>
                    <Textarea
                      {...register("input", {
                        required: "Required",
                      })}
                      bg="white"
                      pl={3}
                      rounded="base"
                      placeholder="Write your message..."
                    />
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.input && errors.input.message}
                  </FormErrorMessage>
                </FormControl>
                <HStack w={"full"}>
                  <Box w="full">
                    <Button
                      float={"left"}
                      onClick={() => {
                        inputAction(false);
                      }}
                      isLoading={createManualMessage.isLoading}
                      size="sm"
                      variant={"default"}
                      rightIcon={<IoSendOutline />}
                    >
                      Send Message as Retain
                    </Button>
                  </Box>
                  <Box w="full">
                    <Button
                      float={"right"}
                      onClick={() => {
                        inputAction(true);
                      }}
                      isLoading={replayMessageMutation.isLoading}
                      size="sm"
                      rightIcon={<IoSendOutline />}
                    >
                      Reply as User
                    </Button>
                  </Box>
                </HStack>
              </VStack>
            </Flex>
          </Stack>
        </Flex>
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnEsc={true}>
        <ModalOverlay />
        <ModalContent
          overflow={"auto"}
          maxW={"70rem"}
          minW={"200px"}
          _light={{ bg: "#fdfdff" }}
          _dark={{ bg: "gray.900" }}
        >
          <ModalHeader>
            <Heading color="blue.700" fontWeight={900} fontSize={"large"}>
              Add Question list
            </Heading>
          </ModalHeader>
          <ModalCloseButton mt={2} />
          <ModalBody>
            <VStack>
              <Textarea rows={10} {...register("questionList", {})}></Textarea>
              <Button
                float={"right"}
                onClick={() => {
                  runQuestionList();
                }}
              >
                Start running
              </Button>
            </VStack>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
