import { MutationObserver, useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { AppThunk } from "./redux";
import { queryClient } from "./queryClient";
import { Todo, todoListApi } from "../api/todoListApi";
import { authSlice } from "./auth.slice";

export const createTodoThunk =
  (text: string): AppThunk =>
  async (dispatch, getState) => {
    const userId = authSlice.selectors.userId(getState());

    if (!userId) {
      throw new Error("Пользователь не залогинен");
    }

    const newTodo: Todo = {
      id: uuidv4(),
      done: false,
      text,
      userId,
    };

    queryClient.cancelQueries({
      queryKey: ["todos"],
    });

    const prevTasks = queryClient.getQueryData(
      todoListApi.getTasksListInfinityQueryOptions().queryKey
    );

    queryClient.setQueryData(
      todoListApi.getTasksListInfinityQueryOptions().queryKey,
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page, index) => ({
            ...page,
            data:
              index === oldData.pages.length - 1
                ? [...page.data, newTodo]
                : page.data,
          })),
        };
      }
    );

    // оптимистическое обновление
    try {
      await new MutationObserver(queryClient, {
        mutationFn: todoListApi.createTodo,
      }).mutate(newTodo);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      queryClient.setQueryData(
        todoListApi.getTasksListInfinityQueryOptions().queryKey,
        prevTasks
      );
    } finally {
      //invalidate помечает все запросы которые подходят по ключу как stale и перезапрашивает
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    }
  };

export const useCreateLoading = () =>
  useMutation({
    mutationKey: ["create-todo"],
  }).isPending;
