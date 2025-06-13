import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { jsonApiInstance } from "./apiInstance";

type Todo = {
  id: string;
  text: string;
  done: boolean;
  userId: string;
};

type PaginatedResult<T> = {
  data: T[];
  first: number;
  items: number;
  last: number;
  next: number | null;
  pages: number;
  prev: number | null;
};

// signal can cancel request
export const todoListApi = {
  baseKey: "todos",
  getTasksListQueryOptions: () => {
    return queryOptions({
      queryKey: [todoListApi.baseKey],
      queryFn: (meta) =>
        jsonApiInstance<Todo[]>(`/tasks`, {
          signal: meta.signal,
        }),
    });
  },

  //queryKey - массив строк для различия запросов друг от друга
  //queryFn - любая асинхронная функция, которая возвращает промис
  getTasksListInfinityQueryOptions: () => {
    return infiniteQueryOptions({
      queryKey: [todoListApi.baseKey],
      queryFn: (meta) =>
        jsonApiInstance<PaginatedResult<Todo>>(
          `/tasks?_page=${meta.pageParam}&_per_page=10`,
          {
            signal: meta.signal,
          }
        ), // meta будет включать сигнал
      // placeholderData - данные которые показываются пока ничего нету
      // placeholderData: keepPreviousData, // показать предыдущие данные пока нет никаких данных
      // initialData - наполнение кэша первоначальными значениями(например из localstorage)
      // enabled позволяю включать/выключать запросы
      initialPageParam: 1,
      getNextPageParam: (result) => result.next,
      //объедить странницы для вывода
      select: (result) => result.pages.flatMap((page) => page.data),
    });
  },

  createTodo: (data: Todo) => {
    return jsonApiInstance<Todo>("/tasks", {
      method: "POST",
      json: data,
    });
  },

  updateTodo: (id: string, data: Partial<Todo>) => {
    return jsonApiInstance<Todo>(`/tasks/${id}`, {
      method: "PATCH",
      json: data,
    });
  },

  deleteTodo: (id: string) => {
    return jsonApiInstance<Todo>(`/tasks/${id}`, {
      method: "DELETE",
    });
  },
};
