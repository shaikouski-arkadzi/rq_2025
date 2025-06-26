import { authApi } from "../api/authApi";
import { authSlice } from "./auth.slice";
import { queryClient } from "./queryClient";
import { store } from "./redux";

export const prefetchAuth = () => {
  const userId = authSlice.selectors.userId(store.getState());
  if (userId) {
    queryClient.prefetchQuery(authApi.getUserById(userId));
  }
};
