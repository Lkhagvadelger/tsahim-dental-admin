import { SystemStyleObject } from "@chakra-ui/theme-tools";

const baseStyle: SystemStyleObject = {
  field: {},
};

const sizes: Record<string, SystemStyleObject> = {
  xs: {
    field: {
      borderRadius: "sm",
      fontSize: "xs",
      height: 6,
      paddingX: 2,
    },
  },
  sm: {
    field: {
      borderRadius: "sm",
      fontSize: "sm",
      height: 8,
      paddingX: 3,
    },
  },
  md: {
    field: {
      borderRadius: "md",
      fontSize: "md",
      height: 10,
      paddingX: 4,
    },
  },
  lg: {
    field: {
      borderRadius: "md",
      fontSize: "lg",
      height: 12,
      paddingX: 4,
    },
  },
};

const variants = {
  outline: {
    field: {
      background: "red",
      border: "1px solid",
      borderColor: "inherit",
      _focus: {
        zIndex: 1,
        borderColor: "#3182ce",
        boxShadow: "0 0 0 1px #3182ce",
      },
      _hover: { borderColor: "gray.300" },
    },
  },
  default: {
    field: {
      background: "gray.100",
      border: "1px solid",
      borderColor: "gray.400",
      borderRadius: "3px",
      p: 3,
      _focus: {
        zIndex: 1,
        borderColor: "#3182ce",
        boxShadow: "0 0 0 1px #3182ce",
      },
      _hover: { borderColor: "gray.300" },
    },
  },
  filled: {
    field: {
      background: "gray.100",
      border: "2px solid",
      borderColor: "transparent",
      _focus: {
        background: "transparent",
        borderColor: "#3182ce",
      },
      _hover: {
        background: "gray.300",
      },
    },
  },
  flushed: {
    field: {
      background: "transparent",
      borderBottom: "1px solid",
      borderColor: "inherit",
      borderRadius: 0,
      paddingX: 0,
      _focus: {
        borderColor: "#3182ce",
        boxShadow: "0 0 0 1px #3182ce",
      },
    },
  },
  unstyled: {
    field: {
      background: "transparent",
      borderRadius: "md",
      height: "auto",
      paddingX: 0,
    },
  },
  fulltextsearch: {
    field: {
      borderRadius: "3px",
      bg: "gray.900",
      paddingLeft: 5,
      autoComplete: "off",
      width: "full",
      fontSize: "2xl",
      type: "text",
      height: 16,
      _focus: {
        bg: "purple.900",
        color: "white",
        borderColor: "purple.500",
      },
    },
  },
};

const defaultProps = {
  size: "md",
  variant: "default",
};

const Input = {
  baseStyle,
  sizes,
  variants,
  defaultProps,
};

export default Input;
