import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import {
  Button,Image,
  chakra,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Stack,
  SimpleGrid,
  VisuallyHidden,
  toaster,
  Box,
} from "@ui/index";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useLogin, useSignup, User } from "@lib/auth/data/authHooks";
import { apiRoot } from "@util/config";
import { PasswordField } from "./PasswordField";
import { PasswordFieldWithConfirm } from "./PasswordFieldWithConfirm";
import { DividerWithText } from "./DividerWithText";

type Props = {
  type: "signup" | "login";
};

type FormValues = {
  email: string;
  password: string;
};



export const AuthForm = ({ type }: Props) => {
  const loginMutation = useLogin();
  const router = useRouter();
  const { t: ta } = useTranslation("auth");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const action =  loginMutation;

  const onSubmit = handleSubmit((authInput) => {
    action.mutate(authInput, {
      onError: (error: any) => {
        toaster.error(ta(error.translationKey));
      },
      onSuccess: (user) => {
        router.push("/admin");
      },
    });
  });

  return (
      <chakra.form onSubmit={onSubmit} >
        <Stack spacing="2">
        
          <FormControl id="email" isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              autoComplete="email"
              {...register("email", {
                required: "This is required",
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          {type === "login" ? (
            <PasswordField
              label={"Password"}
              forgotPasswordLabel={""}
              error={errors.password}
              {...register("password", {
                required: "This is required",
                minLength: { value: 8, message: "Minimum length should be 8" },
              })}
            />
          ) : (
            <PasswordFieldWithConfirm
              label={ta("password")}
              confirmLabel={ta("confirm-password")}
              error={errors.password}
              {...register("password", {
                required: "This is required",
                minLength: {
                  value: 8,
                  message: "Minimum length should be 8",
                },
              })}
            />
          )}
        </Stack>
        <Button
          mt="6"
          type="submit"
          size="lg"
          fontSize="md"
          isFullWidth
          isLoading={action.isLoading}
        >
          {type === "login" ? ("login") : ("signup")}
        </Button>
      </chakra.form>
  
  );
};