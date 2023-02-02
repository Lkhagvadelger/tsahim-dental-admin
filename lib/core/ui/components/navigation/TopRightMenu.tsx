import NextLink from "next/link";
import useTranslation from "next-translate/useTranslation";
import {
  Button,
  Box,
  HStack,
  Menu,
  MenuItem,
  MenuList,
  Text,
  Icon,
  useMenuButton,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaCaretDown } from "react-icons/fa";
import { User, useLogout, useCurrentUser } from "@lib/auth/data/authHooks";
import { ProfileBox } from "./ProfileBox";
import { HiMenu, HiX } from "react-icons/hi";

const MenuButton = ({ isOpen }: { isOpen: boolean }) => {
  const buttonProps = useMenuButton({});
  const { user, isLoggedIn } = useCurrentUser();

  return (
    <Button
      {...buttonProps}
      bg={useColorModeValue("gray.50", "gray.850")}
      borderRadius="3px"
      variant="ghost"
      aria-label="Open user menu"
      color={useColorModeValue("blue.400", "gray.400")}
      pl={{ base: 1, lg: 3 }}
      pr={1}
      h={{ base: 10, lg: 14 }}
    >
      <Icon
        as={isOpen ? HiX : HiMenu}
        display={{ base: "flex", lg: "none" }}
        fontSize={"2xl"}
      />
      <HStack display={{ base: "none", lg: "flex" }} spacing={0}>
        {isLoggedIn && user && <ProfileBox user={user} />}
        <Box>
          <Icon
            as={FaCaretDown}
            mx={1}
            verticalAlign={"middle"}
            color={useColorModeValue("gray.300", "gray.500")}
          />
        </Box>
      </HStack>
    </Button>
  );
};

const MenuPopup = ({ user }: { user: (User & { profile: any }) | null }) => {
  const logoutMutation = useLogout();

  return (
    <MenuList
      rounded={{ base: "none", lg: "md" }}
      color={{
        base: useColorModeValue("gray.600", "gray.50"),
        lg: useColorModeValue("gray.50", "gray.50"),
      }}
      bg={{
        base: useColorModeValue("white", "gray.800"),
        lg: useColorModeValue("gray.300", "gray.800"),
      }}
      fontSize={"sm"}
      shadow="lg"
      mt={{ base: 0, lg: -2 }}
      p={0}
      w={{ base: "100vw", lg: 20 }}
      zIndex={10}
    >
      <HStack px="3" py="3">
        <Box lineHeight="1" py={1}>
          <Text
            fontSize={"xs"}
            fontWeight="medium"
            color={{
              base: useColorModeValue("gray.400", "gray.600"),
              lg: useColorModeValue("gray.600", "gray.600"),
            }}
            textTransform={"uppercase"}
          >
            Хэрэглэгч
          </Text>
          <Text
            mt="1"
            fontSize={"sm"}
            fontWeight={"normal"}
            color={{
              base: useColorModeValue("gray.600", "gray.300"),
              lg: useColorModeValue("gray.800", "gray.300"),
            }}
          >
            {user?.profile?.firstName} {user?.profile?.lastName}
          </Text>
        </Box>
      </HStack>
      <NextLink href="/account/profile" passHref>
        <MenuItem
          as="a"
          fontWeight="bold"
          py={2.5}
          borderTop="1px"
          borderColor={{
            base: useColorModeValue("gray.200", "gray.850"),
            lg: useColorModeValue("gray.50", "gray.850"),
          }}
        >
          Тохиргоо
        </MenuItem>
      </NextLink>
      <NextLink href="/support" passHref>
        <MenuItem
          as="a"
          fontWeight="bold"
          py={2.5}
          borderTop="1px"
          borderColor={{
            base: useColorModeValue("gray.200", "gray.850"),
            lg: useColorModeValue("gray.50", "gray.850"),
          }}
        >
          Тусламж
        </MenuItem>
      </NextLink>
      <MenuItem
        fontWeight="medium"
        color={{
          base: useColorModeValue("red.600", "red.300"),
          lg: useColorModeValue("red.700", "red.300"),
        }}
        onClick={() => logoutMutation.mutate()}
        py={2.5}
        borderTop="1px"
        borderColor={{
          base: useColorModeValue("gray.200", "gray.850"),
          lg: useColorModeValue("gray.50", "gray.850"),
        }}
      >
        Гарах
      </MenuItem>
    </MenuList>
  );
};

export const TopRightMenu = ({
  setMenuOpen,
  user,
}: {
  setMenuOpen: any;
  user: (User & { profile: any }) | null;
}) => {
  const isMobile = useBreakpointValue({ base: true, lg: false });

  return (
    <Menu
      placement={isMobile ? "bottom" : undefined}
      onOpen={() => setMenuOpen(true)}
      onClose={() => setMenuOpen(false)}
    >
      {({ isOpen }) => (
        <>
          <MenuButton isOpen={isOpen} />
          <MenuPopup user={user} />
        </>
      )}
    </Menu>
  );
};
