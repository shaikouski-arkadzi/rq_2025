import { MutationObserver, useMutation } from "@tanstack/react-query";
import { AppThunk } from "./redux";
import { queryClient } from "./queryClient";
import { authApi } from "../api/authApi";
import { authSlice } from "./auth.slice";

export const loginThunk =
  (login: string, password: string): AppThunk =>
  async (dispatch, getState) => {
    // мутация вне компонента
    const user = await new MutationObserver(queryClient, {
      mutationKey: ["login"],
      mutationFn: authApi.loginUser,
    }).mutate({
      login,
      password,
    });

    if (user) {
      dispatch(
        authSlice.actions.addUser({
          userId: user.id,
        })
      );

      queryClient.setQueryData(authApi.getUserById(user.id).queryKey, user);
      localStorage.setItem("userId", user.id);
    }

    dispatch(authSlice.actions.setError("Логин или пароль неверные"));
  };

export const useLoginLoading = () =>
  useMutation({
    mutationKey: ["login"],
  }).isPending;
