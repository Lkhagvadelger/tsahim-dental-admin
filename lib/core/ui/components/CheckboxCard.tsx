import { Box, Text, HStack, useRadio, useCheckbox } from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";

export const CheckboxCard = (props: any) => {
  const { getInputProps, getCheckboxProps } = useCheckbox(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();
  return (
    <Box as="label" w={props.width} h={props.height}>
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderRadius="md"
        boxShadow="md"
        color="white"
        _checked={{
          bg: "purple.500",
          color: "white",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        bg="gray.850"
        px={3}
        py={2}
      >
        {props.children}
      </Box>
    </Box>
  );
};
