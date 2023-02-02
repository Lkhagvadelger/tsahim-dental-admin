import { Box, HStack } from "@chakra-ui/react";
import NextLink from "next/link";
import * as React from "react";
import { FaBullseye } from "react-icons/fa";

interface NavItemProps {
  href?: string;
  label: string;
  subtle?: boolean;
  active?: boolean;
  icon: React.ReactElement;
  endElement?: React.ReactElement;
  children?: React.ReactNode;
}

export const AdminNavItem = (props: NavItemProps) => {
  const {
    href,
    active ,
    subtle,
    icon,
    children,
    label,
    endElement,
  } = props;
  return (
    <NextLink href={href!} passHref>
      <HStack
        w="full"
        p="4"
        cursor="pointer"
        userSelect="none"
        transition="all 0.2s"
        bg={active ? "gray.300" : undefined}
        color={active ? "gray.600" : undefined}
        _hover={{ bg: "gray.600", color: "gray.100" }}
        _active={{ bg: "gray.200", color: "gray.600" }}
      >
        <Box fontSize="lg" color={active ? "currentcolor" : "gray.400"}>
          {icon}
        </Box>
        <Box
          flex="1"
          fontWeight="inherit"
          color={subtle ? "gray.400" : undefined}
        >
          {label}
        </Box>
      </HStack>
    </NextLink>
  );
};
