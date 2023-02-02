import { Avatar, HStack, useColorModeValue } from "@chakra-ui/react";
import { User } from "@lib/auth/data/authHooks";

export const ProfileBox = ({ user }: { user: User & { profile: any } }) => {
  const name = user?.profile?.firstName
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : user?.email;

  return (
    <Avatar
      borderWidth={1}
      borderRadius={"50%"}
      borderColor={useColorModeValue("white", "white")}
      size={"sm"}
      name={name!}
      color={"gray.900"}
      fontWeight={"bold"}
      sx={{ "& > div": { fontSize: "0.625rem" } }}
      bg={useColorModeValue("yellow.500", "yellow.500")}
    />
  );
};
