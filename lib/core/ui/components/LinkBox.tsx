import { ReactNode } from "react";
import NextLink from "next/link";
import { Box, BoxProps } from "@chakra-ui/react";

export const LinkBox = ({
  href,
  box,
  children,
  ...props
}: {
  href?: string;
  box?: boolean;
  children: ReactNode;
} & BoxProps) =>
  href ? (
    <NextLink href={href} passHref>
      {box ? (
        <Box as="a" {...props}>
          {children}
        </Box>
      ) : (
        children
      )}
    </NextLink>
  ) : box ? (
    <Box as="a" {...props}>
      {children}
    </Box>
  ) : (
    <>{children}</>
  );
