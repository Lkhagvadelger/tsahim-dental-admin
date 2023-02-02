import { useRouter } from "next/router";
import NextLink from "next/link";
import { cloneElement, Children } from "react";

type Props = {
  children: any;
  href: string;
  as?: string;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  prefetch?: boolean;
};

export const ActiveLink = ({ children, ...props }: Props) => {
  const { asPath } = useRouter();
  const child = Children.only(children);

  // pages/index.js will be matched via props.href
  // pages/about.js will be matched via props.href
  // pages/[slug].js will be matched via props.as
  const isActive =
    asPath === props.href.replace(/\/$/, "") ||
    asPath === props.as?.replace(/\/$/, "");

  return (
    <NextLink {...props}>
      {cloneElement(child, {
        isActive,
      })}
    </NextLink>
  );
};
