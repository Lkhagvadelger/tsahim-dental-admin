import { Box, Flex, HStack, useColorModeValue } from "@chakra-ui/react";
import { HiViewGrid } from "react-icons/hi";
import { NavItem } from "./NavItem";

const links = [
  {
    label: "Нүүр",
    href: "/",
    icon: <HiViewGrid />,
    requireAuth: false,
  },
  {
    label: "Боломжууд",
    href: "/#features",
    icon: <HiViewGrid />,
    requireAuth: false,
  },
  {
    label: "Үнэ",
    href: "/#price",
    icon: <HiViewGrid />,
    requireAuth: false,
  },
  {
    label: "Холбоо барих",
    href: "/#contact",
    icon: <HiViewGrid />,
    requireAuth: false,
  },
];

type Props = { isOpen?: boolean; rootUrl?: string; isLoggedIn?: boolean };

const MobileNavMenu = ({ isOpen, isLoggedIn = false, rootUrl = "" }: Props) => {
  return (
    <Flex
      hidden={!isOpen}
      as="nav"
      direction="column"
      position="fixed"
      height="calc(100vh - 4rem)"
      top="16"
      insetX="0"
      zIndex={10}
      w="full"
      bg={useColorModeValue("white", "gray.850")}
    >
      <Box px="4">
        {links.map((link) => {
          if (link.requireAuth && !isLoggedIn) return null;
          return (
            <NavItem.Mobile
              key={link.href}
              href={link.href}
              label={link.label}
            />
          );
        })}
      </Box>
    </Flex>
  );
};

const DesktopNavMenu = ({ rootUrl = "", isLoggedIn = false }: Props) => (
  <HStack spacing="3" flex="1" display={{ base: "none", lg: "flex" }}>
    {links.map((link) => {
      if (link.requireAuth && !isLoggedIn) return null;

      return (
        <NavItem.Desktop
          key={link.href}
          href={rootUrl + link.href}
          icon={link.icon}
          label={link.label}
        />
      );
    })}
  </HStack>
);

export const NavMenu = {
  Mobile: MobileNavMenu,
  Desktop: DesktopNavMenu,
};
