import {
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input
} from "@chakra-ui/react";

import {
  MessageInputType,
  useCreateMessages,
  useReplyMessages
} from "@lib/messages/data/messagesHooks";
import { DataEntryModal } from "@ui/components/DataEntryModal";
import { toaster } from "@ui/helpers/toaster";
import { forwardRef, useDisclosure } from "@ui/index";
import { useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";

export const NextQuestionForm = ({
  data,
  closeDialog,
  refresh,
  isCustomer,
}: {
  data: MessageInputType | null | undefined;
  closeDialog: () => void;
  refresh: () => void;
  isCustomer: boolean;
}) => {
  const defaultData = {
    conversationId: "",
    prompt: "",
  };
  const {
    control,
    register,
    handleSubmit,
    formState,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<MessageInputType>({
    defaultValues: {
      ...(data ? data : defaultData),
    },
  });
  const createMessageMutation = useCreateMessages(data!.conversationId!);
  const replayMessageMutation = useReplyMessages(data!.conversationId!);

  const createMessage = async () => {
    if (isCustomer)
      replayMessageMutation.mutate(
        {
          ...getValues(),
        },
        {
          onSuccess: (result) => {
            console.log(result);
            toaster.success("Replied");
          },
          onError: (error: any) => {
            console.log(error);
            toaster.error(error + "");
            console.log(typeof error);
          },
        }
      );
    else
      createMessageMutation.mutate(
        {
          ...getValues(),
        },
        {
          onSuccess: (result) => {
            console.log(result);
            toaster.success("Created");
          },
          onError: (error: any) => {
            console.log(error);
            toaster.error(error + "");
            console.log(typeof error);
          },
        }
      );
  };
  return (
    <chakra.form>
      <HStack>
        <FormControl id="input" isInvalid={!!errors.input}>
          <FormLabel>Customer Reply </FormLabel>
          <Input
            type="text"
            {...register("input", {
              required: "Required",
            })}
          ></Input>
          <FormErrorMessage>
            {errors.input && errors.input.message}
          </FormErrorMessage>
        </FormControl>
      </HStack>
      <HStack gap={3} mt={4}>
        <Button
          isLoading={
            createMessageMutation.isLoading || replayMessageMutation.isLoading
          }
          onClick={handleSubmit(createMessage)}
        >
          Save
        </Button>
      </HStack>
    </chakra.form>
  );
};

const NextQuestion = (
  {
    refresh,
  }: {
    refresh: () => void;
  },
  ref: any
) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [messageData, setMessageData] = useState<
    MessageInputType | undefined | null
  >();
  const [isCustomer, setIsCustomer] = useState<boolean>(false);
  useImperativeHandle(ref, () => ({
    onOpenEdit: (data: MessageInputType, isCustomer: boolean) => {
      setMessageData(data);
      setIsCustomer(isCustomer);
      onOpen();
    },
  }));

  const closeDialog = () => {
    setMessageData(null);
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
      <NextQuestionForm
        closeDialog={closeDialog}
        data={messageData}
        isCustomer={isCustomer}
        refresh={refresh}
      />
    </DataEntryModal>
  );
};

export const NextQuestionModal = forwardRef(NextQuestion);
