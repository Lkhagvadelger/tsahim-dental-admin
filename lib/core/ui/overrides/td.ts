import { SystemStyleObject } from "@chakra-ui/theme-tools";

const baseStyle: SystemStyleObject = {
  borderRadius: "3px",
};

const sizes: Record<string, SystemStyleObject> = {
  md: {
    px: "24px",
  },
};

const variants = {
  solid: {
    p: 0,
  },
};

const defaultProps = {
  size: "md",
  variant: "solid",
  casing: "capitalize",
};

const Td = {
  baseStyle,
  sizes,
  variants,
  defaultProps,
};

export default Td;
