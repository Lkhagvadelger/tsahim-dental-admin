import { Avatar, HStack, useColorModeValue } from "@chakra-ui/react";
import { User } from "@lib/auth/data/authHooks";

export const ProfileBox = ({ user }: { user: User  }) => {
  return (
    <Avatar
      borderWidth={1}
      borderRadius={"50%"}
      borderColor={useColorModeValue("white", "white")}
      size={"sm"}
      name={user.firstName}
      color={"gray.900"}
      fontWeight={"bold"}
      sx={{ "& > div": { fontSize: "0.625rem" } }}
      bg={useColorModeValue("yellow.500", "yellow.500")}
    />
  );
};
