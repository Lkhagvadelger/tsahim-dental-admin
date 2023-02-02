import { mode } from "@chakra-ui/theme-tools";

export const styles = {
  global: (props: any) => ({
    body: {
      fontFamily: "body",
      color: mode("black", "white")(props),
      bg: mode("white", "gray.900")(props),
      lineHeight: "base",
      "#__next": {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        main: {
          flex: 1,
        },
      },
      input: {
        background: mode("gray.100", "gray.850")(props),
        border: "1px solid",
        borderColor: mode("gray.400", "gray.600")(props),
        _focus: {
          background: mode("gray.100", "gray.850")(props),
        },
        _hover: { borderColor: "gray.300" },
      },
    },
    footer: {
      color: mode("black", "whiteAlpha.500")(props),
    },
  }),
};
