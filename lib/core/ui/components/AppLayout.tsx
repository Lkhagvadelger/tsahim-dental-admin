import { ReactNode, useEffect, useState } from "react";
import NextLink from "next/link";
import {
  Box,
  Flex,
  LinkBox,
  Text,
  HStack,
  Heading,
  useColorModeValue,
  useBreakpointValue,
} from "@ui/index";
import { useCurrentUser } from "@lib/auth/data/authHooks";
import { Logo } from "./Logo";
// import { MobileHamburgerMenu } from "./navigation/MobileHamburgerMenu";
// import { NavMenu } from "./navigation/NavMenu";
import { LanguageDropdown } from "./navigation/LanguageDropdown";
import { NotificationDropdown } from "./navigation/NotificationDropdown";
import { ThemeToggler } from "./navigation/ThemeToggler";
// import { useMobileMenuState } from "./navigation/useMobileMenuState";
import { TopRightMenu } from "./navigation/TopRightMenu";

const roleToRootUrl = {
  STUDENT: "/",
  TEACHER: "/",
  ADMIN: "/",
};

export const AppLayout = ({
  title = "",
  contentWidth = "container.xl",
  children,
}: {
  title?: string;
  contentWidth?: string;
  children?: ReactNode;
}) => {
  // const { isMenuOpen, toggle } = useMobileMenuState();
  const { user, isLoggedIn } = useCurrentUser();
  const [rootUrl, setRootUrl] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, lg: false });

  useEffect(() => {
    setRootUrl(roleToRootUrl[user?.role as keyof typeof roleToRootUrl]);
  }, [user]);

  return (
    <>
      <Flex
        as="header"
        align="center"
        px={6}
        minH={{ base: 16, lg: 40 }}
        borderBottomColor={{
          base: useColorModeValue("gray.200", "gray.700"),
          lg: "initial",
        }}
        borderBottomWidth={{ base: "1px", lg: "0px" }}
      >
        <Flex
          justify="space-between"
          align="center"
          w="full"
          maxW="container.xl"
          mx="auto"
        >
          <LinkBox
            href={`/${rootUrl}`}
            box={true}
            flexShrink={0}
            mx={{ base: 0, lg: 10 }}
          >
            <Logo
              w={{ base: "3.75em", lg: "7.5em" }}
              color={{
                base: useColorModeValue("blue.400", "gray.400"),
                lg: useColorModeValue("gray.400", "gray.400"),
              }}
            />
          </LinkBox>

          <Flex display={{ base: "none", lg: "flex" }} w="full" pl={20}>
            <Heading variant="main" size={"2xl"} fontWeight={"normal"}>
              {title}
            </Heading>
          </Flex>
        </Flex>
      </Flex>
      <Box as="main" display="flex" px="6">
        <Box maxW={contentWidth} mx="auto" w="full">
          {children}
        </Box>
      </Box>
     
    </>
  );
};
