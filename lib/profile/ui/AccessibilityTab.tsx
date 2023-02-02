import {
  Heading,
  Text,
  Stack,
  FormControl,
  FormLabel,
  Switch,
  chakra,
  useColorMode,
} from "@ui/index";
import useTranslation from "next-translate/useTranslation";

export const AccessibilityTab = () => {
  const { t } = useTranslation("account");
  const { colorMode, toggleColorMode } = useColorMode();

  const handleChangeTheme = () => {
    toggleColorMode();
  };

  return (
    <>
      <Heading size="md">{t("accessibility")}</Heading>
      <Text size="sm">{t("accessibility-hint")}</Text>
      <chakra.form mt={4}>
        <Stack spacing="6">
          <FormControl>
            <FormLabel>{t("dark-mode")}</FormLabel>
            <small>{t("dark-mode-hint")}</small>
            <Switch
              size="lg"
              isChecked={colorMode === "dark"}
              onChange={handleChangeTheme}
            />
          </FormControl>
        </Stack>
      </chakra.form>
    </>
  );
};
