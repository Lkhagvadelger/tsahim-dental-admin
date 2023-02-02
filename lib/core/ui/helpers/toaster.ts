import { createStandaloneToast } from "@chakra-ui/react";

const isClosable = true;
const duration = 3000;

const toast = createStandaloneToast();

export const toaster = {
  success(message: string, title = "") {
    toast({
      title,
      description: message,
      status: "success",
      duration,
      isClosable,
    });
  },
  info(message: string, title = "") {
    toast({
      title,
      description: message,
      status: "info",
      duration,
      isClosable,
    });
  },
  warning(message: string, title = "") {
    toast({
      title,
      description: message,
      status: "warning",
      duration,
      isClosable,
    });
  },
  error(message: string, title = "") {
    toast({
      title,
      description: message,
      status: "error",
      duration,
      isClosable,
    });
  },
};
