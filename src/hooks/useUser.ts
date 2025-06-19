import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { authApi } from "../api/authApi";
import { authSlice } from "../utils/auth.slice";

export function useUser() {
  const userId = useSelector(authSlice.selectors.userId);
  // Запрос на получение пользователя
  const { data, isLoading } = useQuery({
    ...authApi.getUserById(userId!),
    enabled: Boolean(userId),
  });
  return { data, isLoading };
}
