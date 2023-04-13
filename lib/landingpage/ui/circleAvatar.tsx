import { Box, Image } from "@chakra-ui/react";

export const CircleAvatar = ({ num, src }: { num?: string; src?: string }) => {
  return num ? (
    <Box
      boxSize="34px"
      border="2px solid white"
      borderRadius="full"
      objectFit="cover"
      bg="gray.100"
      fontSize={"14px"}
      fontWeight={500}
      pt={1}
    >
      {num}
    </Box>
  ) : (
    <Image
      src={src ? src : "https://bit.ly/dan-abramov"}
      alt="avatar"
      boxSize="34px"
      border="2px solid white"
      borderRadius="full"
      objectFit="cover"
    />
  );
};
