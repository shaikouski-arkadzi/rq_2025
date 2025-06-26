import { MutationObserver, useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { AppThunk } from "./redux";
import { queryClient } from "./queryClient";
import { Todo, todoListApi } from "../api/todoListApi";
import { authSlice } from "./auth.slice";
import { authApi } from "../api/authApi";

export const createTodoThunk =
  (text: string): AppThunk =>
  async (dispatch, getState) => {
    const userId = authSlice.selectors.userId(getState());

    if (!userId) {
      throw new Error("Пользователь не залогинен");
    }

    // получить данные из кэша
    const user = await queryClient.fetchQuery(authApi.getUserById(userId));

    const newTodo: Todo = {
      id: uuidv4(),
      done: false,
      text: `${text}. Owner: ${user.login}`,
      userId,
    };

    queryClient.cancelQueries({
      queryKey: [todoListApi.baseKey],
    });

    const prevTasks = queryClient.getQueryData(
      todoListApi.getTasksListQueryOptions({ userId }).queryKey
    );

    queryClient.setQueryData(
      todoListApi.getTasksListQueryOptions({ userId }).queryKey,
      (tasks) => [...(tasks ?? []), newTodo]
    );

    // оптимистическое обновление
    try {
      await new MutationObserver(queryClient, {
        mutationFn: todoListApi.createTodo,
      }).mutate(newTodo);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      queryClient.setQueryData(
        todoListApi.getTasksListQueryOptions({ userId }).queryKey,
        prevTasks
      );
    } finally {
      //invalidate помечает все запросы которые подходят по ключу как stale и перезапрашивает
      //await queryClient.invalidateQueries(todoListApi.getTasksListQueryOptions());
      queryClient.invalidateQueries({
        queryKey: [todoListApi.baseKey],
      });
    }
  };

export const useCreateLoading = () =>
  useMutation({
    mutationKey: ["create-todo"],
  }).isPending;
