import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

type Todo = {
  id: string;
  text: string;
  done: boolean;
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

const BASE_URL = "http://localhost:3000";

export const todoListApi = {
  // signal can cancel request
  getTasks: (
    { page }: { page: number },
    { signal }: { signal: AbortSignal }
  ) => {
    return fetch(`${BASE_URL}/tasks?_page=${page}&_per_page=10`, {
      signal,
    }).then((res) => res.json() as Promise<PaginatedResult<Todo>>);
  },

  getTasksListQueryOptions: ({ page }: { page: number }) => {
    return queryOptions({
      queryKey: ["todos", { page }],
      queryFn: (meta) => todoListApi.getTasks({ page }, meta),
    });
  },

  //queryKey - массив строк для различия запросов друг от друга
  //queryFn - любая асинхронная функция, которая возвращает промис
  getTasksListInfinityQueryOptions: () => {
    return infiniteQueryOptions({
      queryKey: ["todos"],
      queryFn: (meta) => todoListApi.getTasks({ page: meta.pageParam }, meta), // meta будет включать сигнал
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
};
