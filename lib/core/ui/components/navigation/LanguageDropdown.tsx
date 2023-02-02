import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  useMenuButton,
  UseMenuButtonProps,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { IoLanguage } from "react-icons/io5";

const LanguageMenuButton = (props: UseMenuButtonProps) => {
  const buttonProps = useMenuButton(props);
  return (
    <IconButton
      {...buttonProps}
      variant="ghost"
      aria-label="Open language menu"
      icon={
        <Icon
          as={IoLanguage}
          w={6}
          h={6}
          color={useColorModeValue("gray.300", "gray.400")}
        />
      }
    />
  );
};

const locales = [
  { name: "English", value: "en" },
  { name: "Монгол", value: "mn" },
];

export const LanguageDropdown = () => {
  const { asPath } = useRouter();

  return (
    <Menu>
      <LanguageMenuButton />
      <MenuList
        rounded="md"
        shadow="lg"
        py="1"
        color={useColorModeValue("gray.800", "gray.400")}
        fontSize="sm"
        zIndex={10}
      >
        {locales.map((locale) => (
          <NextLink key={locale.value} href={asPath} locale={locale.value}>
            <MenuItem fontWeight="medium" as="a">
              {locale.name}
            </MenuItem>
          </NextLink>
        ))}
      </MenuList>
    </Menu>
  );
};
