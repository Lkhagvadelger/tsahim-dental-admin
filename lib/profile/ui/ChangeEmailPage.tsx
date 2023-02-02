import { useForm } from "react-hook-form";
import {
  SEO,
  AppLayout,
  NavMenuLayout,
  NavContentLayout,
  Stack,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  toaster,
  chakra,
} from "@ui/index";
import { PasswordField } from "@lib/auth/ui";
import useTranslation from "next-translate/useTranslation";
import { useCurrentUser } from "@lib/auth/data/authHooks";
import { useChangeEmail } from "@lib/profile/data/profileHooks";
import { useRouter } from "next/router";
import { navItems } from ".";

export const ChangeEmailPage = () => {
  const { t } = useTranslation("account");
  const { data: currentUser } = useCurrentUser();
  const router = useRouter();
  const changeEmailMutation = useChangeEmail();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    email: string;
    password: string;
  }>();

  const onSubmit = handleSubmit((changeEmailInput) => {
    changeEmailMutation.mutate(changeEmailInput, {
      onError: (error: any) => {
        toaster.error(t(error.translationKey));
      },
      onSuccess: (data) => {
        toaster.success(t("email-success-message"), t("email-success-title"));
        router.push("/account/credentials");
      },
    });
  });

  return (
    <AppLayout title={t("change-email")}>
      <SEO title={t("change-email")} />
      <NavMenuLayout
        title={t("change-email")}
        backLink={{ name: t(`back-button`), link: "/" }}
        navItems={navItems.map((navItem) => ({
          name: t(`${navItem.name}`),
          link: navItem.link,
          type: navItem.name === "credentials" ? "active" : "",
        }))}
      >
        <NavContentLayout
          actions={
            <>
              <Button
                variant={"outline"}
                onClick={() => {
                  router.push("/account/credentials");
                }}
              >
                {t("email-cancel")}
              </Button>
              <Button
                variant={"control"}
                disabled={!!errors.email || !!errors.password}
                isLoading={changeEmailMutation.isLoading}
                onClick={onSubmit}
              >
                {t("email-update")}
              </Button>
            </>
          }
        >
          <chakra.form onSubmit={onSubmit}>
            <Stack spacing="6">
              <Text size="sm">{t("change-email-hint")}</Text>
              <FormControl>
                <FormLabel>{t("email-current")}</FormLabel>
                <Input
                  type="text"
                  autoComplete="off"
                  value={currentUser?.email!}
                  readOnly
                />
              </FormControl>
              <FormControl id="email" isInvalid={!!errors.email}>
                <FormLabel>{t("email-new")}</FormLabel>
                <Input
                  type="email"
                  autoComplete="off"
                  {...register("email", { required: "This is required" })}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl id="password" isInvalid={!!errors.password}>
                <PasswordField
                  label={t("email-password")}
                  forgotPasswordLabel=""
                  error={errors.password}
                  {...register("password", { required: "This is required" })}
                />
              </FormControl>
            </Stack>
          </chakra.form>
        </NavContentLayout>
      </NavMenuLayout>
    </AppLayout>
  );
};
