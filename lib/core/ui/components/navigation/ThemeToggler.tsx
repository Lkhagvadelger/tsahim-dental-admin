import {
  IconButton,
  useColorMode,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { IoSunny } from "react-icons/io5";

export const ThemeToggler = () => {
  const { toggleColorMode } = useColorMode();

  return (
    <IconButton
      variant="ghost"
      aria-label="Theme toggler"
      color={useColorModeValue("gray.300", "gray.400")}
      icon={<Icon as={IoSunny} w={6} h={6} />}
      onClick={toggleColorMode}
    />
  );
};
