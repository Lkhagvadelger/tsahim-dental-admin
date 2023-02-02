import { ReactNode } from "react";
import { Box, HStack, Spinner } from "@ui/index";
import { Card } from "./Card";

export const NavContentLayout = ({
  actions,
  isLoading,
  children,
  ...props
}: {
  actions?: ReactNode;
  isLoading?: boolean;
  children?: ReactNode | ReactNode[];
}) => {
  return (
    <Box
      position={"relative"}
      flex="1"
      h="full"
      display="flex"
      flexDirection="column"
      pb={20}
      {...props}
    >
      {!isLoading ? null : (
        <Box
          display={"flex"}
          position={"absolute"}
          zIndex={9}
          w={"full"}
          h={"full"}
          bg={"white"}
          opacity={0.66}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Spinner size={"lg"} color={"green.600"} thickness="3px" mt={-150} />
        </Box>
      )}
      {children && Array.isArray(children) ? (
        children.map((_, i) => (
          <Card key={`card-${i}`} px={8} py={8} mb={4}>
            {_}
          </Card>
        ))
      ) : (
        <Card flex="1" px={16} py={16} mb={4}>
          {children}
        </Card>
      )}
      {actions ? (
        <HStack spacing={2} justify="right" mt={4} mx={{ base: 6, lg: 0 }}>
          {actions}
        </HStack>
      ) : null}
    </Box>
  );
};
