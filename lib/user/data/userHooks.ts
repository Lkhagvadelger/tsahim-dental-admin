import { useQuery, useMutation } from "react-query";
import { fetcher } from "@util/query";

// We should subset this to only interface we need.
import { User as PrismaUser } from "@prisma/client";
import { QueryParamType } from "@ui/hooks/query-param";

// Get list of all users
export const useUsers = (filter: QueryParamType) => {
  return useQuery(
    ["userslist", filter.size, filter.page, filter.text],
    () => fetcher.post("users/list", filter),
    { enabled: !!filter }
  );
};
export const useGetUsers = () => {
  return useQuery(["getuserlist"], () => fetcher.get("users"), {});
};
// Create a new user
export const useCreateUser = () => {
  return useMutation((data: any) => fetcher.post("users", data));
};

// Update an existing user
export const useUpdateUser = () => {
  return useMutation((data: any) => fetcher.put(`users/${data.id}`, data));
};
export const useUpdateAutoReply = () => {
  return useMutation((data: any) =>
    fetcher.put(`users/${data.id}/autoreply`, data)
  );
};

export const useNewSlackPost = () => {
  return useMutation((data: any) =>
    fetcher.put(`users/${data.id}/slack`, data)
  );
};
