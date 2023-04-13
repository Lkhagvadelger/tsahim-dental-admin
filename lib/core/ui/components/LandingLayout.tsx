import { ReactNode } from "react";
import {
  Box,
  Stack,
  Image,
  LinkBox,
  UnorderedList,
  Text,
  ListItem,
  Heading,
  Icon,
  Collapse,
  Progress,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
  VStack,
  Flex,
  HStack,
  Button,
} from "@ui/index";
import useTranslation from "next-translate/useTranslation";
import { useMobileMenuState } from "./navigation/useMobileMenuState";
import { FiArrowLeft } from "react-icons/fi";
import { NavMenu } from "./navigation/NavMenu";

export const LandingLayout = ({ children }: { children?: ReactNode }) => {
  const { t } = useTranslation("app");
  const { isMenuOpen, toggle } = useMobileMenuState();
  const isMobile = useBreakpointValue({ base: true, lg: false });

  return (
    <Box px={4}>
      <VStack
        h="full"
        spacing={0}
        mx="auto"
        maxW={{ base: "full", lg: "container.lg" }}
      >
        <Flex width={{ base: "full", lg: "full" }} my={5}>
          <HStack w="full">
            <Image src="/images/tsahim-dental.svg" />
            <Text fontSize={24} color="gray.900" fontWeight={500}>
              {" "}
              ЦАХИМ ДЕНТАЛ
            </Text>
            <Flex flex="1" justifyContent={"flex-end"}>
              {isMobile ? (
                <></>
              ) : (
                <HStack
                  gap="3"
                  color={"gray.700"}
                  cursor={"pointer"}
                  fontWeight={500}
                  fontSize={"16px"}
                  F
                >
                  <Text>Нүүр</Text>
                  <Text>Боломжууд</Text>
                  <Text>Үнэ</Text>
                  <Text>Холбоо барих</Text>
                  <Button>Нэвтрэх</Button>
                </HStack>
              )}
            </Flex>
          </HStack>
        </Flex>
        <Box flex="1" h="full" display="flex" flexDirection="column">
          {children}
        </Box>
      </VStack>
    </Box>
  );
};
