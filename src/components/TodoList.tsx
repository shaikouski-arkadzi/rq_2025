import { useState } from "react";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import getTasks from "../api/getTasks";
import { useIntersection } from "../hooks/useIntersection";

const TodoList = () => {
  const [enabled, setEnabled] = useState(false);

  //queryKey - массив строк для различия запросов друг от друга
  //queryFn - любая асинхронная функция, которая возвращает промис
  //status - наличие данных в кэше. если нет данных-pending. success. error
  //fetchStatus - состояние загрузки. fetching - получаем. paused. idle - ожидание
  //isFetching - на перезапрос
  //isPending - если данных нет
  const {
    data,
    error,
    isPending,
    isFetching,
    isLoading,
    status,
    fetchStatus,
    isPlaceholderData,
    fetchNextPage, // подгружает новую страницу
    hasNextPage, // флаг есть ли следующая страница
    isFetchingNextPage, // флаг срабатывает когда подгружаем следующую страницу
  } = useInfiniteQuery({
    queryKey: ["todos"],
    queryFn: (meta) => getTasks({ page: meta.pageParam }, meta), // meta будет включать сигнал
    // placeholderData - данные которые показываются пока ничего нету
    // placeholderData: keepPreviousData, // показать предыдущие данные пока нет никаких данных
    // initialData - наполнение кэша первоначальными значениями(например из localstorage)
    // enabled позволяю включать/выключать запросы
    enabled: enabled,
    initialPageParam: 1,
    getNextPageParam: (result) => result.next,
    select: (result) => result.pages.flatMap((page) => page.data),
  });

  const cursorRef = useIntersection(() => {
    fetchNextPage();
  });

  //status === "pending" && fetchStatus === "fetching"
  if (isLoading) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>error: {JSON.stringify(error)}</div>;
  }

  return (
    <div className="p-5 mx-auto max-w-[1200px] mt-10">
      <h1 className="text-3xl font-bold mb-5">Todo List</h1>
      <button className="text-blue-300" onClick={() => setEnabled((e) => !e)}>
        Toggle enabled
      </button>
      <div
        className={
          "flex flex-col gap-4 mb-5" + (isPlaceholderData ? " opacity-50" : "")
        }
      >
        {data?.map((todo) => (
          <div className="border border-slate-300 rounded p-3" key={todo.id}>
            {todo.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt4" ref={cursorRef}>
        {!hasNextPage && <div>Нет данных для загрузки</div>}
        {isFetchingNextPage && <div>Loading...</div>}
      </div>
    </div>
  );
};

export default TodoList;
