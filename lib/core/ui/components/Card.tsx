import { Box, BoxProps, useColorModeValue } from "@ui/index";

export const Card = (props: BoxProps) => (
  <Box
    px={{ base: "4", md: "10" }}
    borderRadius="3px"
    {...props}
  />
);
