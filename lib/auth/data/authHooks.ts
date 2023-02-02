import { useQueryClient, useMutation, useQuery } from "react-query";
import { fetcher } from "@util/query";
import { AppError } from "@util/errors";

// We should subset this to only interface we need.
import { User as PrismaUser, UserRole } from "@prisma/client";
export type User = Pick<PrismaUser, "id" | "email" | "phoneNumber" | "role">;

type AuthInput = { email: string; password: string };
export type RegisterInputType = {
  id?: string;
  email: string;
  password?: string;
  passwordConfirm?: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  profile: {
    firstName: string;
    lastName: string;
  };
  role: UserRole;
  timeZone?: string;
};
type PhoneAuthInput = {
  phoneNumber: string;
  confirmationCode?: string;
  password?: string;
};

const useHandleAuth = (shouldInvalidate = false) => {
  const queryClient = useQueryClient();

  const handleAuth = (user: User) => {
    queryClient.setQueryData("currentUser", user);
    if (shouldInvalidate) {
      queryClient.invalidateQueries();
    }
  };

  return handleAuth;
};

export const useCurrentUser = () => {
  const query = useQuery<User & { profile: any }, AppError>(
    "currentUser",
    () => fetcher.get("auth/current"),
    {
      retry: false,
    }
  );

  return {
    isLoggedIn: query.data ? !!query.data.id : false,
    user: query.data && query.data.id ? query.data : null,
    ...query,
  };
};

export const useLogin = () => {
  const handleAuth = useHandleAuth();
  return useMutation((data: AuthInput) => fetcher.post("auth/login", data), {
    onSuccess: handleAuth,
  });
};

export const useSignupPhone = () => {
  const handleAuth = useHandleAuth();
  return useMutation(
    (data: PhoneAuthInput) => fetcher.post("auth/signupphone", data),
    {
      onSuccess: handleAuth,
      onError: (errordata) => {
        console.log(errordata + " user signup error");
      },
    }
  );
};
export const useSignup = () => {
  const handleAuth = useHandleAuth();
  return useMutation((data: AuthInput) => fetcher.post("auth/signup", data), {
    onSuccess: handleAuth,
    onError: (errordata) => {
      console.log(errordata + " user signup error");
    },
  });
};
export const useRegisterUser = () => {
  return useMutation((data: RegisterInputType) =>
    fetcher.post("auth/registeruser", data)
  );
};
export const useUpdateUser = (id?: string) => {
  return useMutation((data: RegisterInputType) =>
    fetcher.put("auth/registeruser?id=" + id, data)
  );
};
export const useChangeUserPassword = (id?: string) => {
  return useMutation((data: RegisterInputType) =>
    fetcher.put("auth/changepassword?id=" + id, data)
  );
};
export const useDeleteUser = (id?: string) => {
  return useMutation((data: RegisterInputType) =>
    fetcher.delete("auth/registeruser?id=" + id, data)
  );
};

export const usePhoneVerification = () => {
  const handleAuth = useHandleAuth();
  return useMutation(
    (data: PhoneAuthInput) => fetcher.post("auth/sendverification", data),
    {
      onSuccess: handleAuth,
    }
  );
};
export const usePhoneConfirmation = () => {
  const handleAuth = useHandleAuth();
  return useMutation(
    (data: PhoneAuthInput) => fetcher.post("auth/confirmverification", data),
    {
      onSuccess: handleAuth,
    }
  );
};
export const useLogout = () => {
  const handleAuth = useHandleAuth(true);
  return useMutation(({}) => fetcher.delete("auth/logout"), {
    onSuccess: handleAuth,
  });
};
