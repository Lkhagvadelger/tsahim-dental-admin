import {
  Box,
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";

import { toaster } from "@ui/helpers/toaster";
import { useForm } from "react-hook-form";
import {
  BotInputType,
  useCreateBot,
  useDeleteBot,
  useUpdateBot,
} from "../data/botHooks";
import { SliderWithTitle } from "./SliderWithTitle";

export const BotForm = ({
  data,
  closeDialog,
  refresh,
}: {
  data: BotInputType | undefined | null;
  closeDialog: () => void;
  refresh: () => void;
}) => {
  const defaultData = {
    userId: "",
    name: "",
    prompt: "",
    initialPrompt: "",
    temperature: 0,
    maximumLength: 1,
    top_p: 0,
    frequency_penalty: 0,
    presence_penalty: 0,
    best_of: 1,
  };
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
  } = useForm<BotInputType>({
    defaultValues: {
      ...(data ? data : defaultData),
    },
  });
  const createBotMutation = useCreateBot();
  const updateBotMutation = useUpdateBot();
  const deleteBotMutation = useDeleteBot();

  const upsertBot = async () => {
    if (getValues("id")) {
      updateBotMutation.mutate(
        {
          ...getValues(),
        },
        {
          onSuccess: (result) => {
            setValue("id", result.id);
            toaster.success("Saved");
            closeDialog();
          },
          onError: (error: any) => {
            console.log(error);
            toaster.error(error + "");
            console.log(typeof error);
          },
        }
      );
    } else
      createBotMutation.mutate(
        {
          ...getValues(),
        },
        {
          onSuccess: (result) => {
            setValue("id", result.id);
            toaster.success("Saved");
            closeDialog();
          },
          onError: (error: any) => {
            console.log(error);
            toaster.error(error + "");
            console.log(typeof error);
          },
        }
      );
  };

  const deleteBot = async () => {
    if (getValues("id")) {
      deleteBotMutation.mutate(
        {
          ...getValues(),
        },
        {
          onSuccess: (result) => {
            setValue("id", result.id);
            toaster.success("Deleted");
            closeDialog();
          },
          onError: (error: any) => {
            console.log(error);
            toaster.error(error + "");
            console.log(typeof error);
          },
        }
      );
    }
  };
  return (
    <chakra.form>
      <VStack>
        <FormControl id="name" isInvalid={!!errors.name}>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            {...register("name", {
              required: "Required",
            })}
          ></Input>
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl id="initialPrompt" isInvalid={!!errors.initialPrompt}>
          <FormLabel fontSize={"bold"}>initial Prompt</FormLabel>
          <Textarea
            rows={8}
            type="text"
            {...register("initialPrompt", {
              required: "required",
            })}
          ></Textarea>
          <FormErrorMessage>
            {errors.initialPrompt && errors.initialPrompt.message}
          </FormErrorMessage>
        </FormControl>
        <VStack w={"full"} gap={2}>
          <SliderWithTitle
            label="Temperature"
            setValue={setValue}
            defaultValue={getValues("temperature")}
            min={0}
            max={1}
            step={0.01}
            name={"temperature"}
          />
          <SliderWithTitle
            label="Maximum length"
            setValue={setValue}
            defaultValue={getValues("max_tokens")}
            min={1}
            max={4000}
            step={1}
            name={"max_tokens"}
          />
          <SliderWithTitle
            label="Top P"
            setValue={setValue}
            defaultValue={getValues("top_p")}
            min={0}
            max={1}
            step={0.01}
            name={"top_p"}
          />
          <SliderWithTitle
            label="Frequency Penalty"
            setValue={setValue}
            defaultValue={getValues("frequency_penalty")}
            min={0}
            max={2}
            step={0.01}
            name={"frequency_penalty"}
          />
          <SliderWithTitle
            label="Presence Penalty"
            setValue={setValue}
            defaultValue={getValues("presence_penalty")}
            min={0}
            max={2}
            step={0.01}
            name={"presence_penalty"}
          />
          <SliderWithTitle
            label="Best of"
            setValue={setValue}
            defaultValue={getValues("best_of")}
            min={1}
            max={20}
            step={1}
            name={"best_of"}
          />
        </VStack>

        {/* <FormControl id="summarizePrompt" isInvalid={!!errors.summarizePrompt}>
          <FormLabel>summarizePrompt</FormLabel>
          <Textarea
            type="text"
            rows={8}
            {...register("summarizePrompt", {
              required: "reqiured",
            })}
          ></Textarea>
          <FormErrorMessage>
            {errors.summarizePrompt && errors.summarizePrompt.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl id="finisherPrompt" isInvalid={!!errors.finisherPrompt}>
          <FormLabel>Finisher Prompt</FormLabel>
          <Textarea
            type="text"
            rows={8}
            {...register("finisherPrompt", {
              required: "reqiured",
            })}
          ></Textarea>
          <FormErrorMessage>
            {errors.finisherPrompt && errors.finisherPrompt.message}
          </FormErrorMessage>
        </FormControl> */}
      </VStack>
      <HStack gap={3} mt={4}>
        <Button
          isLoading={createBotMutation.isLoading}
          size="sm"
          onClick={handleSubmit(upsertBot)}
        >
          Save
        </Button>
        <Button
          variant={"delete"}
          size="sm"
          isLoading={deleteBotMutation.isLoading}
          onClick={handleSubmit(deleteBot)}
        >
          Delete
        </Button>
      </HStack>
    </chakra.form>
  );
};
