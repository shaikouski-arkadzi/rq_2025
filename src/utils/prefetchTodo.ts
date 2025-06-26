import { todoListApi } from "../api/todoListApi";
import { authSlice } from "./auth.slice";
import { queryClient } from "./queryClient";
import { store } from "./redux";

export const prefetchTodo = () => {
  const userId = authSlice.selectors.userId(store.getState());
  if (userId) {
    // подготовить данные параллельно ренденрингу
    queryClient.prefetchQuery(todoListApi.getTasksListQueryOptions({ userId }));
  }
};
