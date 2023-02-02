import { ReactNode } from "react";
import {
  Box,
  Heading,
  Card,
  useColorModeValue,
  LinkBox,
  Logo,
  HStack,
} from "@ui/index";

type Props = {
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  actions?: ReactNode;
};

export const AuthLayout = ({ header, children, footer, actions }: Props) => (
  <Box
    flex={1}
    minH="100vh"
    py="10"
    m={"auto"}
    maxW={512}
    w={"full"}
    px={{ base: "4", lg: "8" }}
  >
    <Box mx="auto">
      <LinkBox href={`/`} box={true} flexShrink={0} mx={{ base: 0, lg: 10 }}>
        <Logo
      
          w={"full"}
          color={{
            base: useColorModeValue("blue.400", "gray.400"),
            lg: useColorModeValue("gray.400", "gray.400"),
          }}
        />
      </LinkBox>
      <Card w={"full"}>{children}</Card>
      {footer && <Box mt={2}>{footer}</Box>}
      {actions ? (
        <HStack spacing={2} justify="right" mt={4} mx={{ base: 6, lg: 0 }}>
          {actions}
        </HStack>
      ) : null}
    </Box>
  </Box>
);
