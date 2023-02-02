import { ReactNode } from "react";
import { Button } from "@chakra-ui/react";
import { ActiveLink } from "./ActiveLink";

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
    <ActiveLink href={href} passHref>
      <Button
        as="a"
        aria-current={active ? "page" : undefined}
        variant="ghost"
        leftIcon={<>{icon}</>}
      >
        {label}
      </Button>
    </ActiveLink>
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
