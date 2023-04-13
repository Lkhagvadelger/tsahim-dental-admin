import { ReactNode } from "react";
import { Button, Text } from "@chakra-ui/react";
import { ActiveLink } from "./ActiveLink";
import NextLink from "next/link";

type NavItemProps = {
  href?: string;
  active?: boolean;
  label: string;
};

type DesktopNavItemProps = NavItemProps & {
  icon: ReactNode;
};

const DesktopNavItem = (props: DesktopNavItemProps) => {
  const { icon, label, href = "#", active } = props;
  return (
    <NextLink href={href}>
      <Text color={"gray.700"} cursor={"pointer"} fontWeight={500} fontSize={"16px"}>
        {label}
      </Text>
    </NextLink>
  );
};

const MobileNavItem = (props: NavItemProps) => {
  const { label, href = "#", active } = props;
  return (
    <ActiveLink href={href} passHref>
      <Button as="a" variant="ghost" aria-current={active ? "page" : undefined}>
        {label}
      </Button>
    </ActiveLink>
  );
};

export const NavItem = {
  Desktop: DesktopNavItem,
  Mobile: MobileNavItem,
};
