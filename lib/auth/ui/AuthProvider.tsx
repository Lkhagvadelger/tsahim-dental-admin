import { useContext, createContext, ReactNode } from "react";
import { useCurrentUser } from "@lib/auth/data/authHooks";

const AuthContext = createContext<Partial<ReturnType<typeof useCurrentUser>>>(
  {}
);

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const currentUser = useCurrentUser();
  return (
    <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
