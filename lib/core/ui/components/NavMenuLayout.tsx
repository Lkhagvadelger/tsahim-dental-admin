import { ReactNode } from "react";
import {
  Box,
  Stack,
  LinkBox,
  UnorderedList,
  ListItem,
  Heading,
  Icon,
  Collapse,
  Progress,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
} from "@ui/index";
import useTranslation from "next-translate/useTranslation";
import { useMobileMenuState } from "./navigation/useMobileMenuState";
import { FiArrowLeft } from "react-icons/fi";

const NavTitle = ({
  title,
  backLink,
  isMobile = false,
}: {
  title?: string;
  backLink?: { name: string; link: string };
  isMobile?: boolean;
}) => {
  const backColor = useColorModeValue("yellow.600", "yellow.500");

  return (
    <Box
      display={backLink || (isMobile && title) ? "block" : "none"}
      borderBottomWidth={{ base: 0, lg: "1px" }}
      borderColor={useColorModeValue("gray.200", "gray.850")}
      ml={1}
      mr={{ base: 0, lg: 6 }}
      pt={{ base: 1, lg: 0 }}
      pb={{ base: 1, lg: 6 }}
    >
      <LinkBox href={backLink?.link} box={true}>
        <Box
          as={"span"}
          display={"inline-block"}
          textAlign={"center"}
          fontSize={"xl"}
          fontWeight={"medium"}
          verticalAlign={"text-top"}
          lineHeight={1}
          color={backColor}
          w={6}
        >
          <Icon as={FiArrowLeft} display={backLink ? "block" : "none"} mx={1} />
        </Box>
        <Box
          as="span"
          display={backLink && !(title && isMobile) ? "inline-block" : "none"}
          fontSize={"sm"}
          fontWeight={"medium"}
          textTransform={"uppercase"}
          lineHeight={1}
          color={backColor}
          pl={4}
        >
          {backLink?.name}
        </Box>
        <Heading
          as={"span"}
          variant={"main"}
          display={{ base: "inline-block", lg: "none" }}
          lineHeight={1}
          size={"xs"}
          fontWeight={"bold"}
          color={useColorModeValue("gray.800", "blue.600")}
          pl={4}
        >
          {title}
        </Heading>
      </LinkBox>
    </Box>
  );
};

const NavItem = ({
  name,
  link,
  type,
  bullet,
  total,
  isMobile = false,
  isMenuOpen = false,
  onToggle,
  ...rest
}: {
  name: string;
  link?: string;
  type?: string;
  bullet?: number;
  total?: number;
  isMobile?: boolean;
  isMenuOpen?: boolean;
  onToggle?: any;
}) => {
  const { colorMode } = useColorMode();
  const colors = {
    bg: "green.500",
    fg: "white",
    cl: !isMobile && colorMode !== "dark" ? "green.500" : "white",
    br: "transparent",
  };
  if (bullet) {
    if (type === "visited") {
      colors.bg = "purple.500";
      colors.fg = colorMode !== "dark" ? "white" : "gray.900";
      colors.cl =
        colorMode !== "dark"
          ? isMobile
            ? "purple.700"
            : "purple.500"
          : isMobile
          ? "purple.300"
          : "purple.500";
    } else if (type === "disabled") {
      colors.bg = colorMode !== "dark" ? "gray.100" : "gray.850";
      colors.fg = colorMode !== "dark" ? "white" : "gray.900";
      colors.cl =
        colorMode !== "dark"
          ? isMobile
            ? "gray.500"
            : "gray.200"
          : "gray.800";
    }
  } else if (type === "active") colors.br = "green.500";
  return (
    <Collapse in={!isMobile || type === "active" || isMenuOpen}>
      <ListItem onClick={onToggle} py={{ base: 1, lg: 2 }}>
        <LinkBox
          href={link}
          box={true}
          fontSize="lg"
          lineHeight={6}
          borderLeftWidth="2px"
          borderColor={colors.br}
          ml={bullet ? 1 : 6}
          {...rest}
        >
          {!bullet ? null : isMobile ? (
            <Box as="span" display={"inline-block"} w={6} />
          ) : (
            <Box
              as="span"
              display={"inline-block"}
              bg={colors.bg}
              color={colors.fg}
              textAlign={"center"}
              borderRadius="2px"
              fontSize={"xs"}
              fontWeight={"medium"}
              lineHeight={6}
              verticalAlign={"top"}
              w={6}
            >
              {bullet}
            </Box>
          )}
          <Box
            as="span"
            display={"inline-block"}
            color={colors.cl}
            fontSize={{ base: "sm", lg: "lg" }}
            fontWeight="medium"
            lineHeight={6}
            pl={4}
          >
            {name}
          </Box>
          {isMobile && bullet && type === "active" ? (
            <Progress
              value={total ? (bullet * 100) / total : 0}
              w={28}
              sx={{ div: { backgroundColor: "green.500" } }}
              bg={"green.100"}
              borderRadius={6}
              size="md"
              my={2}
              ml={2}
              mr={6}
              float={"right"}
            />
          ) : null}
        </LinkBox>
      </ListItem>
    </Collapse>
  );
};

export const NavMenuLayout = ({
  title = "",
  navItems = [],
  numbered = false,
  backLink,
  children,
}: {
  title?: string;
  navItems?: { name: string; link?: string; type?: string }[];
  numbered?: boolean;
  backLink?: { name: string; link: string };
  children?: ReactNode;
}) => {
  const { t } = useTranslation("interview");
  const { isMenuOpen, toggle } = useMobileMenuState();
  const isMobile = useBreakpointValue({ base: true, lg: false });

  return (
    <Stack
      direction={{ base: "column", lg: "row" }}
      h="full"
      align="top"
      mx={{ base: -6, lg: 0 }}
      spacing={0}
    >
      <Box width={{ base: "full", lg: 60 }} ml={0}>
        <NavTitle title={t(title)} backLink={backLink} isMobile={isMobile} />
        <UnorderedList
          styleType="none"
          ml={0}
          py={{ base: 0, lg: 3 }}
          bg={{
            base: useColorModeValue("purple.200", "gray.700"),
            lg: "inherit",
          }}
        >
          {navItems.map((item, i) => (
            <NavItem
              key={item.name}
              name={item.name}
              link={item.link}
              type={item.type}
              bullet={numbered ? i + 1 : undefined}
              total={numbered ? navItems.length + 1 : undefined}
              isMobile={isMobile}
              isMenuOpen={isMenuOpen}
              onToggle={toggle}
            />
          ))}
        </UnorderedList>
      </Box>
      <Box flex="1" h="full" display="flex" flexDirection="column">
        {children}
      </Box>
    </Stack>
  );
};
