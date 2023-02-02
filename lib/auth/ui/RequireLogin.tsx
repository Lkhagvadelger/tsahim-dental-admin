import { useEffect, ReactNode, ComponentType } from "react";
import { useRouter } from "next/router";
import { useAuth } from "./AuthProvider";
import { useCurrentUser } from "../data/authHooks";

type RequireLoginProps = {
  redirectBack?: boolean;
  children: ReactNode;
};
// Component wrapper for requiring login
// Usage:
//   <RequireLogin>{page}</RequireLogin>;
export const RequireLogin = ({
  redirectBack = true,
  children,
}: RequireLoginProps) => {
  const router = useRouter();
  const { isLoggedIn, status } = useAuth();

  useEffect(() => {
    if (status === "error" && !isLoggedIn) {
      const nextRoute = redirectBack ? router.pathname : "";
      router.push({
        pathname: "/auth/login",
        query: { redirectTo: nextRoute },
      });
    }
  }, [isLoggedIn, status, router, redirectBack]);

  // Loading current user
  if (status !== "success" || !isLoggedIn) return null;
  //user is logged in and check is onboarding info completed !email

  
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

export const withRequireLogin = (Component: ComponentType) => {
  const WithRequireLogin = (props: any) => {
    return (
      <RequireLogin>
        <Component {...props} />
      </RequireLogin>
    );
  };

  return WithRequireLogin;
};
