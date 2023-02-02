import { useState, useEffect, ChangeEvent } from "react";
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
  Switch,
  chakra,
} from "@ui/index";
import { useProfile, useToggleNotify } from "@lib/profile/data/profileHooks";
import { navItems } from ".";

export const NotificationsPage = () => {
  const { t } = useTranslation("account");
  const { data: profile, refetch } = useProfile();
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [notifyPush, setNotifyPush] = useState(false);
  const [notifyBadge, setNotifyBadge] = useState(false);
  const toggleNotifyMutation = useToggleNotify();

  useEffect(() => {
    setNotifyEmail(profile ? profile.notifyEmail : false);
    setNotifyPush(profile ? profile.notifyPush : false);
    setNotifyBadge(profile ? profile.notifyBadge : false);
  }, [profile]);

  const toggleNotify = (e: ChangeEvent, toggleName: string) => {
    e.preventDefault();
    toggleNotifyMutation.mutate(
      { toggleName },
      {
        onError: (error) => {
          console.log(error);
        },
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  return (
    <AppLayout title={t("notifications")}>
      <SEO title={t("notifications")} />
      <NavMenuLayout
        title={t("notifications")}
        backLink={{ name: t(`back-button`), link: "/" }}
        navItems={navItems.map((navItem) => ({
          name: t(`${navItem.name}`),
          link: navItem.link,
          type: navItem.name === "notifications" ? "active" : "",
        }))}
      >
        <NavContentLayout>
          <chakra.form>
            <Stack spacing="6">
              <Text size="sm">{t("notifications-hint")}</Text>
              <FormControl id="notify-email">
                <FormLabel>{t("notify-email")}</FormLabel>
                <Switch
                  mr={3}
                  size="lg"
                  isChecked={notifyEmail}
                  onChange={(e) => toggleNotify(e, "notifyEmail")}
                />
                <small>{t("notify-email-hint")}</small>
              </FormControl>
              <FormControl id="notify-push">
                <FormLabel>{t("notify-push")}</FormLabel>
                <Switch
                  mr={3}
                  size="lg"
                  isChecked={notifyPush}
                  onChange={(e) => toggleNotify(e, "notifyPush")}
                />
                <small>{t("notify-push-hint")}</small>
              </FormControl>
              <FormControl id="notify-badge">
                <FormLabel>{t("notify-badge")}</FormLabel>
                <Switch
                  mr={3}
                  size="lg"
                  isChecked={notifyBadge}
                  onChange={(e) => toggleNotify(e, "notifyBadge")}
                />
                <small>{t("notify-badge-hint")}</small>
              </FormControl>
            </Stack>
          </chakra.form>
        </NavContentLayout>
      </NavMenuLayout>
    </AppLayout>
  );
};
