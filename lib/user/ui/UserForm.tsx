import {
  chakra,
  FormControl,
  FormLabel,
  Text,
  Textarea,
  useColorModeValue,
  Input,
  Button,
  Box,
  VStack,
  HStack,
  FormErrorMessage,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Select,
} from "@chakra-ui/react";
import { faker } from "@faker-js/faker";

import {
  RegisterInputType,
  useChangeUserPassword,
  useDeleteUser,
  useRegisterUser,
  useUpdateUser,
} from "@lib/auth/data/authHooks";
import { PasswordField } from "@lib/auth/ui";
import { toaster } from "@ui/helpers/toaster";
import moment from "moment-timezone";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNewSlackPost } from "../data/userHooks";

export const UserForm = ({
  data,
  closeDialog,
  refresh,
  isChangePassword = false,
}: {
  data: RegisterInputType | undefined | null;
  closeDialog: () => void;
  refresh: () => void;
  isChangePassword?: boolean | undefined | null;
}) => {
  const isDev = process.env.NODE_ENV !== "production";
  const defaultData = {
    email: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    password: "",
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
  } = useForm<RegisterInputType>({
    defaultValues: {
      ...(data ? data : defaultData),
      firstName: data?.firstName,
      lastName: data?.lastName,
    },
  });
  console.log(data?.timeZone);

  const createUserMutation = useRegisterUser();
  const updateUserMutation = useUpdateUser(getValues("id"));
  const deleteUserMutation = useDeleteUser(getValues("id"));
  const changeUserPasswordMutation = useChangeUserPassword(getValues("id"));
  const newSlackPost = useNewSlackPost();
  const newSlackPostAction = async () => {
    newSlackPost.mutate(
      {
        ...getValues(),
      },
      {
        onSuccess: (result) => {
          toaster.success("New Slack Post Created");
        },
        onError: (error: any) => {
          console.log(error);
          toaster.error(error + "");
          console.log(typeof error);
        },
      }
    );
  };
  const upsertUser = async () => {
    if (getValues("id"))
      updateUserMutation.mutate(
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

            toaster.error(error);
          },
        }
      );
    else
      createUserMutation.mutate(
        {
          ...getValues(),
        },
        {
          onSuccess: (result) => {
            console.log(result);
            setValue("id", result.id);
            toaster.success("New User Created");
          },
          onError: (error: any) => {
            console.log(error);
            toaster.error(error + "");
            console.log(typeof error);
          },
        }
      );
  };
  const deleteUser = async () => {
    deleteUserMutation.mutate(
      {
        ...getValues(),
      },
      {
        onSuccess: (result) => {
          toaster.success("User info Deleted");
          closeDialog();
        },
        onError: (e: any) => {
          toaster.error(e);
        },
      }
    );
  };
  const changePassword = async () => {
    if (getValues("password") != getValues("passwordConfirm")) {
      toaster.error("Password and Confirm Password not match");
      return;
    }
    changeUserPasswordMutation.mutate(
      {
        ...getValues(),
      },
      {
        onSuccess: (result) => {
          toaster.success("Password changed");
          closeDialog();
        },
        onError: (e: any) => {
          toaster.error(e);
        },
      }
    );
  };
  return (
    <chakra.form>
      {isChangePassword == false && (
        <>
          <HStack>
            <FormControl id="firstName" isInvalid={!!errors.firstName}>
              <FormLabel fontSize={"bold"}>First Name</FormLabel>
              <Input
                type="text"
                {...register("firstName", {
                  required: "Required",
                })}
              ></Input>
              <FormErrorMessage>
                {errors.firstName && errors.firstName.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl id="lastName" isInvalid={!!errors.lastName}>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                {...register("lastName", {
                  required: "Required",
                })}
              ></Input>
              <FormErrorMessage>
                {errors.lastName && errors.lastName.message}
              </FormErrorMessage>
            </FormControl>
          </HStack>
          <HStack>
            <FormControl id="email" isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                disabled={getValues("id") !== undefined}
                type="email"
                {...register("email", {
                  required: "Required",
                })}
              ></Input>
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl id="phoneNumber" isInvalid={!!errors.phoneNumber}>
              <FormLabel>Phonenumber</FormLabel>
              <Input
                type="phoneNumber"
                disabled={getValues("id") !== undefined}
                {...register("phoneNumber", {
                  required: "Required",
                })}
              ></Input>
              <FormErrorMessage>
                {errors.phoneNumber && errors.phoneNumber.message}
              </FormErrorMessage>
            </FormControl>
          </HStack>
        </>
      )}

      {(!getValues("id") || isChangePassword == true) && (
        <PasswordField
          label={"Password"}
          forgotPasswordLabel={""}
          error={errors.password}
          {...register("password", {
            required: "Required",
            minLength: {
              value: 8,
              message: "At least 8 characters ",
            },
          })}
        />
      )}
      {getValues("id") && isChangePassword == true && (
        <PasswordField
          label={"Confirm password"}
          forgotPasswordLabel={""}
          error={errors.passwordConfirm}
          {...register("passwordConfirm", {
            required: "Required",
            minLength: {
              value: 8,
              message: "At least 8 characters",
            },
          })}
        />
      )}
      <HStack gap={3} mt={4}>
        <Button
          isLoading={
            createUserMutation.isLoading || updateUserMutation.isLoading
          }
          onClick={
            isChangePassword
              ? handleSubmit(changePassword)
              : handleSubmit(upsertUser)
          }
        >
          {isChangePassword ? "Change Password" : "Save"}
        </Button>

        {getValues("id") && !isChangePassword && (
          <>
            <Button variant={"delete"} onClick={deleteUser}>
              Delete
            </Button>
            <Button
              isLoading={newSlackPost.isLoading}
              onClick={handleSubmit(newSlackPostAction)}
            >
              New Slack Post Id
            </Button>
          </>
        )}
      </HStack>
    </chakra.form>
  );
};
