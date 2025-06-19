import { queryOptions } from "@tanstack/react-query";
import { jsonApiInstance } from "./apiInstance";

export type User = {
  id: string;
  login: string;
  password: string;
};

export const authApi = {
  getUserById: (id: string) => {
    return queryOptions({
      queryKey: ["users", "byId", id],
      queryFn: (meta) =>
        jsonApiInstance<User>(`/users/${id}`, {
          signal: meta.signal,
        }),
    });
  },

  loginUser: ({ login, password }: { login: string; password: string }) => {
    return jsonApiInstance<User[]>(
      `/users?login=${login}&password=${password}`
    ).then((r) => r[0] as User | undefined);
  },
};
