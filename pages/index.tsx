import NextLink from "next/link";
import useTranslation from "next-translate/useTranslation";
import { SEO, Center, Link } from "@ui/index";
import { AuthLayout, useAuth } from "@lib/auth/ui";
import { AuthForm } from "@lib/auth/ui/AuthForm";
import { useRouter } from "next/router";

const HomePage = () => {
  const { t } = useTranslation("auth");
  const route  = useRouter();
  const { user } = useAuth();
  if(user)
    route.push("/admin")
  return (
    <>
    <SEO title={t("login")} />
    <AuthLayout
      header={t("login-header")}
      footer={
        <Center>
         
        </Center>
      }
    >
      
      {!user && <AuthForm type="login"/>}
    </AuthLayout>
  </>
  );
};

export default HomePage;
