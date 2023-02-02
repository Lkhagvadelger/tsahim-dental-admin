import { Avatar, Box, HStack, VStack, Text, Tooltip } from "@ui/index";
import { FaCircleNotch } from "react-icons/fa";
import { IoFlagOutline, IoFlagSharp } from "react-icons/io5";
import TimeAgo from "react-timeago";

export const MyMessage = ({ name, data }: { name: string; data: any }) => {
  const divContent = { __html: data.userResponse.replace(/\n/g, "<br>") };

  return (
    <HStack w="full" justifyContent={"flex-end"} verticalAlign={"top"} mt={2}>
      <HStack pl={"10%"}>
      <Box fontSize={"11px"}>
          {data.userData && data.userData.toString().length > 8 && (
            <Text>{data.userData}</Text>
          )}
        </Box>
        {data.shouldFinish && (
          <Box>
            <Tooltip label="Should finish triggered" aria-label="A tooltip">
              <Box>
                <IoFlagSharp />
              </Box>
            </Tooltip>
          </Box>
        )}
      

        <Box>
          <Box
            rounded="md"
            bg="blue.50"
            border={"1px"}
            p={"3"}
            borderColor={"gray.200"}
            textAlign={"left"}
          >
            <Box dangerouslySetInnerHTML={divContent} lineHeight={"1.2"} fontSize={"13"} textAlign="justify">
              
            </Box>
          </Box>
          <Text fontSize={"12"}>
            <TimeAgo date={data.updatedAt} />
          </Text>
        </Box>
      </HStack>
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
    </HStack>
  );
};
