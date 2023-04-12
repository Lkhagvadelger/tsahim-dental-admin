import {
  Avatar,
  AvatarBadge,
  Box, Stack, Text
} from "@ui/index";

type Props = {
  image?: string;
  phoneNumber?: string;
  name?: string;
  email?: string | null;
};

export const UserDescription = ({ phoneNumber, email }: Props) => (
  <Stack direction="row" align="center">
    <Box flexShrink={0} h="10" w="10">
      <Avatar
        borderWidth={1}
        borderRadius={"50%"}
        borderColor={"white"}
        size={"sm"}
        color={"gray.900"}
        fontWeight={"bold"}
        sx={{ "& > div": { fontSize: "0.625rem" } }}
        bg={"blue.500"}
      >
        <AvatarBadge
          boxSize={6}
          fontSize={"0 !important"}
          opacity={0.7}
        ></AvatarBadge>
      </Avatar>
    </Box>
  </Stack>
);
