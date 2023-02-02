import { HiPencil } from "react-icons/hi";
import useTranslation from "next-translate/useTranslation";
import {
  SEO,
  AppLayout,
  NavMenuLayout,
  NavContentLayout,
  Text,
  Stack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  chakra,
} from "@ui/index";
import { useCurrentUser } from "@lib/auth/data/authHooks";
import { useRouter } from "next/router";
import { navItems } from ".";

export const CredentialsPage = () => {
  const { t } = useTranslation("account");
  const { data: currentUser } = useCurrentUser();
  const router = useRouter();

  return (
    <AppLayout title={t("credentials")}>
      <SEO title={t("credentials")} />
      <NavMenuLayout
        title={t("credentials")}
        backLink={{ name: t(`back-button`), link: "/" }}
        navItems={navItems.map((navItem) => ({
          name: t(`${navItem.name}`),
          link: navItem.link,
          type: navItem.name === "credentials" ? "active" : "",
        }))}
      >
        <NavContentLayout>
          <chakra.form>
            <Stack spacing="6">
              <Text size="sm">{t("credentials-hint")}</Text>
              <FormControl>
                <FormLabel>{t("email-current")}</FormLabel>
                <InputGroup>
                  <InputRightElement>
                    <IconButton
                      bg="transparent !important"
                      variant="ghost"
                      aria-label={t("email-change")}
                      icon={<HiPencil />}
                      onClick={() => {
                        router.push("/account/credentials/email");
                      }}
                    />
                  </InputRightElement>
                  <Input
                    type="text"
                    autoComplete="off"
                    value={currentUser?.email!}
                    readOnly
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel>{t("password-current")}</FormLabel>
                <InputGroup>
                  <InputRightElement>
                    <IconButton
                      bg="transparent !important"
                      variant="ghost"
                      aria-label={t("email-change")}
                      icon={<HiPencil />}
                      onClick={() => {
                        router.push("/account/credentials/password");
                      }}
                    />
                  </InputRightElement>
                  <Input
                    type="password"
                    autoComplete="off"
                    value="****************"
                    readOnly
                  />
                </InputGroup>
              </FormControl>
            </Stack>
          </chakra.form>
        </NavContentLayout>
      </NavMenuLayout>
    </AppLayout>
  );
};
