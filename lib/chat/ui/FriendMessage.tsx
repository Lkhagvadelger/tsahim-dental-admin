import { Avatar, Box, HStack, VStack, Text, Icon, Tooltip } from "@ui/index";
import { BiCheck, BiCheckCircle, BiDetail } from "react-icons/bi";
import { FaSms } from "react-icons/fa";
import TimeAgo from "react-timeago";

export const FriendMessage = ({
  name,
  text,
  createdDate,
  deliveryReport,
}: {
  name: string;
  text: string;
  createdDate: Date;
  deliveryReport?: Date;
}) => {
  const divContent = { __html: text.replace(/\n/g, "<br>") };
  return (
    <HStack w="full" verticalAlign={"top"}>
      <Avatar
        borderWidth={1}
        borderRadius="50%"
        borderColor="white"
        size="sm"
        name={name}
        color="gray.900"
        fontWeight="bold"
        sx={{ "& > div": { fontSize: "0.625rem", color: "white" } }}
      />
      <Box pr={"10%"} textAlign={"right"}>
        <HStack>
          <Box
            rounded="md"
            bg="white"
            border={"1px"}
            p={"3"}
            borderColor={"gray.100"}
            textAlign={"left"}
          >
            <Box
              dangerouslySetInnerHTML={divContent}
              lineHeight={"1.2"}
              fontSize={"13"}
              textAlign="justify"
            ></Box>
          </Box>
          <Box>
            {deliveryReport && (
              <Tooltip label="Message Delivered">
                <Box>
                  <Icon as={BiCheckCircle} />
                </Box>
              </Tooltip>
            )}
          </Box>
        </HStack>
        <Text fontSize={"12"} w={"full"} textAlign={"left"}>
          <TimeAgo date={createdDate} />
        </Text>
      </Box>
    </HStack>
  );
};
