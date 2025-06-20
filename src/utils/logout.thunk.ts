import { authSlice } from "./auth.slice";
import { queryClient } from "./queryClient";
import { AppThunk } from "./redux";

export const logoutThunk = (): AppThunk => async (dispatch) => {
  dispatch(authSlice.actions.removeUser());
  //очиска кэша
  queryClient.removeQueries();
  localStorage.removeItem("userId");
};
