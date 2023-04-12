import {
  Box,
  Flex,
  Heading,
  LinkBox, useColorModeValue
} from "@ui/index";
import { ReactNode } from "react";
import { Logo } from "./Logo";

export const AppLayout = ({
  title = "",
  contentWidth = "container.xl",
  children,
}: {
  title?: string;
  contentWidth?: string;
  children?: ReactNode;
}) => {
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
            href={`/`}
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
