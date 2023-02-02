import { useForm } from "react-hook-form";
import {
  SEO,
  AppLayout,
  NavMenuLayout,
  NavContentLayout,
  Stack,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Button,
  toaster,
  chakra,
  Box,
} from "@ui/index";
import { PasswordField, useAuth } from "@lib/auth/ui";
import useTranslation from "next-translate/useTranslation";
import { useChangePassword } from "@lib/profile/data/profileHooks";
import { useRouter } from "next/router";
import { navItems } from ".";
import { useCurrentUser } from "@lib/auth/data/authHooks";

export const ChangePasswordPage = () => {
  const auth = useAuth();
  const router = useRouter();
  const changePasswordMutation = useChangePassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    passwordCurrent: string;
    passwordNew: string;
    passwordConfirmation: string;
  }>();

  const onSubmit = handleSubmit((changePasswordInput) => {
    if (
      changePasswordInput.passwordNew !==
      changePasswordInput.passwordConfirmation
    )
      toaster.error("Password and confirm password do not match");
    else
      changePasswordMutation.mutate(
        {
          current: changePasswordInput.passwordCurrent,
          password: changePasswordInput.passwordNew,
        },
        {
          onError: (error: any) => {
            toaster.error("Error. " + error);
          },
          onSuccess: () => {
            toaster.success("Password changed successfully");
            router.push("/account/credentials");
          },
        }
      );
  });

  return (
    <Box p={3}>
      <chakra.form onSubmit={onSubmit} w={"auto"}>
        <Stack spacing="3">
          <Heading>Email address: {auth && auth.data?.email}</Heading>
          <FormControl>
            <PasswordField
              id="password-reenter"
              label={"Current password"}
              forgotPasswordLabel=""
              error={errors.passwordCurrent}
              {...register("passwordCurrent", {
                required: "Required",
              })}
            />
          </FormControl>
          <FormControl>
            <PasswordField
              id="password-new"
              label={"New Password"}
              forgotPasswordLabel=""
              error={errors.passwordNew}
              {...register("passwordNew", {
                required: "Required",
                minLength: {
                  value: 8,
                  message: "At least 8 characters.",
                },
              })}
            />
          </FormControl>
          <FormControl>
            <PasswordField
              id="password-confirmation"
              label={"Confirm new password"}
              forgotPasswordLabel=""
              error={errors.passwordConfirmation}
              {...register("passwordConfirmation", {
                required: "Required",
                minLength: {
                  value: 8,
                  message: "At least 8 characters.",
                },
              })}
            />
          </FormControl>
          <Button
            variant={"control"}
            disabled={
              !!errors.passwordCurrent ||
              !!errors.passwordNew ||
              !!errors.passwordConfirmation
            }
            isLoading={changePasswordMutation.isLoading}
            onClick={onSubmit}
          >
            Change password
          </Button>
        </Stack>
      </chakra.form>
    </Box>
  );
};
