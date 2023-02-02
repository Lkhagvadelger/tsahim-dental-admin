import { Box, Flex, HStack, Image, Stack, Text } from "@chakra-ui/react";
import { BiBot, BiLogOut, BiNews, BiUser } from "react-icons/bi";
import { AdminNavItem } from "./AdminNavItem";

export const Sidebar = ({ selectedNav }: { selectedNav: string }) => {
  const w = 64;
  return (
    <Flex
      h="full"
      minW={{ base: w, lg: w, md: w }}
      w={{ base: w, lg: w, md: w }}
      direction="column"
      borderRight={{ base: "0px", md: "1px", lg: "1px" }}
    >
      <Box w={"full"} pt={0}>
        <HStack w={w} h={"full"} alignItems={"center"}>
          <Flex w={w} h={"full"} justifyContent={"space-around"}>
            <Image src="/Logo.svg" h={8} mt={4} />
          </Flex>
        </HStack>
      </Box>

      <Stack spacing="0" flex="1" overflow="auto" pt="6">
        <AdminNavItem href="/users" icon={<BiUser />} label="All users" />
        <AdminNavItem
          key="chat"
          href="/chat"
          active={selectedNav == "chat"}
          icon={<BiNews />}
          label="Chat"
        />
        <AdminNavItem
          key="bot"
          href="/bot"
          active={selectedNav == "bot"}
          icon={<BiBot />}
          label="Bot"
        />
        <AdminNavItem
          key="account"
          href="/account"
          icon={<BiUser />}
          label="My Account"
        />
        <AdminNavItem href="/auth/logout" icon={<BiLogOut />} label="Logout" />
      </Stack>
    </Flex>
  );
};
