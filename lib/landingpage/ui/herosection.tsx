import {
  Box,
  Button,
  Heading,
  Image,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CircleAvatar } from "./circleAvatar";

export const HeroSection = () => {
  return (
    <VStack>
      <Box
        width={{ lg: "full" }}
        mx={{ base: "6", md: "8", lg: "0" }}
        px={{ base: "6", md: "8", lg: "0" }}
        py={{ base: "6", md: "8", lg: "12" }}
      >
        <VStack textAlign={"center"} spacing={{ base: 4, lg: 8 }}>
          <Box borderRadius={"30px"} p={2} px={4} bg="success.100">
            <Text color="success.800" fontWeight={500}>
              Шинэ үеийн шүдний эмнэлэгийн програм
            </Text>
          </Box>
          <Heading
            fontSize={{ base: "32px", lg: "60px" }}
            lineHeight={{ base: 10, lg: "72px" }}
            fontWeight="600"
          >
            Шүдний эмнэлэгийнхээ үйл ажиллагааг бүрэн автоматжуул
          </Heading>
          <Text
            color="gray.600"
            maxW={"600px"}
            fontWeight={400}
            fontSize={"md"}
          >
            Бидэнд утасны дугаараа үлдээж хүлээлгийн жагсаалтад бүртгүүлэн,
            програм хангамж бэлэн болсон үед хамгийн түрүүнд ашиглаж эхлээрээ.
          </Text>
          <Box>
            <InputGroup size="xl">
              <Input
                borderColor={"gray.300"}
                borderRadius="10px"
                bg="white"
                _focus={{ bg: "transparent" }}
                h={14}
                fontSize={"20px"}
                pl="4"
                pr="14"
                type={"number"}
                placeholder="Утасны дугаар"
              />
              <InputRightElement>
                <Button
                  mt={1}
                  fontSize={"16px"}
                  lineHeight={"24px"}
                  mr={1}
                  h={12}
                  variant={"default"}
                >
                  Бүртгүүлэх
                </Button>
              </InputRightElement>
            </InputGroup>
          </Box>
          <Box>
            {/* 5 different avatar overlapped 30% and avatar size 32px, avatar appearance is circle */}
            <HStack spacing={-2}>
              <CircleAvatar />
              <CircleAvatar />
              <CircleAvatar />
              <CircleAvatar />
              <CircleAvatar />
              <CircleAvatar num="+9" />
              <Box pl={4}>57+ нээлт хүлээж байна</Box>
            </HStack>
          </Box>
          <Box>
            <Image
              borderRadius={"24px"}
              border={"12px solid black"}
              src="/images/landing.png"
              alt=""
            />
          </Box>
        </VStack>
      </Box>
    </VStack>
  );
};
