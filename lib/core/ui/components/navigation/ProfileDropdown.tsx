import NextLink from "next/link";
import useTranslation from "next-translate/useTranslation";
import {
  IconButton,
  Avatar,
  Box,
  HStack,
  Menu,
  MenuItem,
  MenuList,
  Text,
  useMenuButton,
  UseMenuButtonProps,
  useColorModeValue,
} from "@chakra-ui/react";
import { User, useLogout } from "@lib/auth/data/authHooks";

const UserAvatar = ({ picture, name }: { picture?: string; name?: string }) => (
  <Avatar size="sm" src={picture} name={name} />
);

const ProfileMenuButton = (props: UseMenuButtonProps) => {
  const buttonProps = useMenuButton(props);
  return (
    <IconButton
      {...buttonProps}
      rounded="full"
      variant="ghost"
      aria-label="Open user menu"
      icon={<UserAvatar />}
    />
  );
};

export const ProfileDropdown = ({ user }: { user: User }) => {
  const logoutMutation = useLogout();
  return (
    <Menu>
      <ProfileMenuButton />
      <MenuList
        rounded="md"
        shadow="lg"
        py="1"
        color={useColorModeValue("gray.600", "inherit")}
        fontSize="sm"
        zIndex={10}
      >
        <HStack px="3" py="4">
          <UserAvatar name={user?.email!} />
          <Box lineHeight="1">
            <Text mt="1" size="xs" color="gray.500">
              {user?.email}
            </Text>
          </Box>
        </HStack>
        <NextLink href="/support">
          <MenuItem as="a" fontWeight="medium">
            Feedback & Support
          </MenuItem>
        </NextLink>
        <MenuItem
          fontWeight="medium"
          color={useColorModeValue("red.500", "red.300")}
          onClick={() => logoutMutation.mutate()}
        >
          Sign out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
