import { SystemStyleObject } from "@chakra-ui/theme-tools";

const baseStyle: SystemStyleObject = {};

const sizes: Record<string, SystemStyleObject> = {};

const variants = {
  blueCapitalize: {
    color: "blue.600",
    fontSize: "0.875rem",
    textTransform: "capitalize",
  },
  bluelabel: {
    color: "blue.600",
    fontSize: "0.625rem",
    textTransform: "uppercase",
  },
  graylabel: {
    color: "gray.600",
    fontSize: "0.625rem",
    textTransform: "uppercase",
  },
  dataLabelFinished: {
    color: "white",
    fontSize: "1.125rem",
  },
  dataLabelPending: {
    color: "pink.500",
    fontSize: "1.125rem",
  },
};

const defaultProps = {};

const Text = {
  baseStyle,
  sizes,
  variants,
  defaultProps,
};

export default Text;
