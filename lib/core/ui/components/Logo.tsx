import { chakra,Image, HTMLChakraProps } from "@chakra-ui/react";

export const Logo = (
  props: HTMLChakraProps<"svg"> & { iconColor?: string }
) => {
  const { iconColor = "currentColor", ...rest } = props;
  return (
    <Image src="/Logo.svg"  m={"auto"}/>
  );
};
