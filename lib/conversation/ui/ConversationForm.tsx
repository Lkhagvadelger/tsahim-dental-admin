import {
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { useBotList } from "@lib/bot/data/botHooks";
import { useGetUsers } from "@lib/user/data/userHooks"; 

import { toaster } from "@ui/helpers/toaster";
import { convertJsonProfileToProfile } from "@util/converter";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  ConversationInputType,
  useCreateConversation,
} from "../data/conversationHooks";

export const ConversationForm = ({
  data,
  closeDialog,
  refresh,
}: {
  data: ConversationInputType | undefined | null;
  closeDialog: () => void;
  refresh: () => void;
}) => {
  const defaultData = {
    userId: "",
    prompt: "",
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
  } = useForm<ConversationInputType>({
    defaultValues: {
      ...(data ? data : defaultData),
    },
  });
  watch(["profile", "userId"]);
  const router = useRouter();
  const createConversationMutation = useCreateConversation();
  const { data: userData } = useGetUsers();
  const { data: botList } = useBotList();

  const createConversation = async () => {
    createConversationMutation.mutate(
      {
        ...getValues(),
      },
      {
        onSuccess: (result) => {
          setValue("id", result.id);
          toaster.success("Saved");
        },
        onError: (error: any) => {
          console.log(error);
          toaster.error(error.translationKey + "");
          console.log(typeof error);
        },
      }
    );
  };
  useEffect(() => {
    if (userData) {
      const profileStr = userData.filter(
        (user: any) => user.id === getValues("userId")
      )[0].profile?.profileData;
      if (profileStr)
        setValue("profile", convertJsonProfileToProfile(profileStr));
      else setValue("profile", "");
    }
  }, [getValues("userId")]);
  return (
    <chakra.form>
      <HStack>
        <FormControl id="user" isInvalid={!!errors.userId}>
          <FormLabel>User</FormLabel>
          <Select
            placeholder="Select user"
            {...register("userId", {
              required: "required",
            })}
          >
            {userData?.map((user: any, i: number) => (
              <option key={i} value={user.id}>
                {user.phoneNumber} - {user.profile?.firstName}{" "}
                {user.profile?.lastName}
              </option>
            ))}
          </Select>
          <FormErrorMessage>
            {errors.userId && errors.userId.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl id="bots" isInvalid={!!errors.botId}>
          <FormLabel fontSize={"bold"}>Conversation Main bot</FormLabel>
          <Select
            placeholder="Select bot"
            {...register("botId", {
              required: "required",
            })}
          >
            {botList?.map((bot: any, i: number) => (
              <option key={i} value={bot.id}>
                {bot.name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>
            {errors.botId && errors.botId.message}
          </FormErrorMessage>
        </FormControl>
      </HStack>
      <HStack>
        <FormControl id="profile" isInvalid={!!errors.profile}>
          <FormLabel>Profile</FormLabel>
          <Textarea
            type="text"
            rows={12}
            placeholder={`-walk 30 minutes 5 days a week
-eat healthy
-meditate for 10 minutes each night
-loose 30 pounds in 6 moths.
-she needs a lot of motivation 
-she has a bad knee so running is difficult`}
            {...register("profile", {
              required: false,
            })}
          ></Textarea>
          <FormErrorMessage>
            {errors.profile && errors.profile.message}
          </FormErrorMessage>
        </FormControl>
      </HStack>
      <HStack gap={3} mt={4}>
        <Button
          isLoading={createConversationMutation.isLoading}
          onClick={handleSubmit(createConversation)}
        >
          Save
        </Button>
        {/* <Button
          isLoading={conversaionSummaryMutation.isLoading}
          onClick={callConversaionSummaryMutation}
        >
          Get current chat summary
        </Button> */}
      </HStack>
    </chakra.form>
  );
};
