import NextLink from "next/link";
import useTranslation from "next-translate/useTranslation";
import { SEO, Center, Link } from "@ui/index";
import { AuthLayout } from "@lib/auth/ui";
import { AuthForm } from "@lib/auth/ui/AuthForm";

const SignupPage = () => {
  const { t } = useTranslation("auth");

  return (
    <>
      <SEO title={t("signup")} />
      <AuthLayout
        header={t("signup-header")}
        footer={
          <Center>
            <NextLink href="/auth/login">
              <Link>{t("already-have-account")}</Link>
            </NextLink>
          </Center>
        }
      >
        <AuthForm type="signup" />
      </AuthLayout>
    </>
  );
};

export default SignupPage;
