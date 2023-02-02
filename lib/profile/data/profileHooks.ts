import { useQuery, useMutation } from "react-query";
import { fetcher } from "@util/query";

import { Profile as PrismaProfile } from "@prisma/client";
export type Profile = Pick<
  PrismaProfile,
  | "userId"
  | "firstName"
  | "lastName"
  | "birthDate"
  | "notifyEmail"
  | "notifyPush"
  | "notifyBadge"
>;

// Get profile for user
export const useProfile = () => {
  return useQuery<Profile>("profile", () => fetcher.get("profile"), {
    initialData: {
      userId: "",
      firstName: "",
      lastName: "",
      birthDate: null,
      notifyEmail: true,
      notifyPush: true,
      notifyBadge: true,
    },
  });
};

// Update profile
export const useUpdateProfile = () => {
  return useMutation((data: Partial<Profile>) =>
    fetcher.patch(`profile`, data)
  );
};

type ToggleInput = { toggleName: string };

// Toggle notify
export const useToggleNotify = () => {
  return useMutation((data: ToggleInput) =>
    fetcher.patch(`profile/notify`, data)
  );
};

type ChangeEmailInput = { email: string; password: string };

// Toggle notify
export const useChangeEmail = () => {
  return useMutation((data: ChangeEmailInput) =>
    fetcher.put(`profile/email`, data)
  );
};

type ChangePasswordInput = { current: string; password: string };

// Toggle notify
export const useChangePassword = () => {
  return useMutation((data: ChangePasswordInput) =>
    fetcher.put(`profile/password`, data)
  );
};
