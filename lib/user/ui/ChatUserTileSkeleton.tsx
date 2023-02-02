import {
  Avatar,
  Box,
  HStack,
  VStack,
  Text,
  SkeletonText,
  SkeletonCircle,
  Stack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import * as React from "react";
import { FaBullseye } from "react-icons/fa";

export const ChatUserTileSkeleton = () => {
  return (
    <Stack>
      <Box padding="3" boxShadow="sm" bg="white">
        <SkeletonCircle size="8" />
        <SkeletonText mt="2" noOfLines={2} spacing="2" skeletonHeight="2" />
      </Box>
    </Stack>
  );
};
