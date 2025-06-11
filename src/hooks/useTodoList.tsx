import { useInfiniteQuery } from "@tanstack/react-query";
import { todoListApi } from "../api/getTasks";
import { useIntersection } from "./useIntersection";

export function useTodoList(enabled: boolean) {
  const {
    data,
    error,
    isPending, // если нужно пока нет данных что-то отобразить
    isFetching, // если нужно на перезапрос данных что-то отобразить
    isLoading, // если нужно на загрузку данных что-то отобразить
    status, // наличие данных в кэше. если нет данных-pending. success. error
    fetchStatus, // состояние загрузки. fetching - получаем. paused. idle - ожидание
    isPlaceholderData, // если во время подгрузки новых данных отображаются данные-заглушки
    fetchNextPage, // подгружает новую страницу
    hasNextPage, // флаг есть ли следующая страница
    isFetchingNextPage, // флаг срабатывает когда подгружаем следующую страницу
  } = useInfiniteQuery({
    ...todoListApi.getTasksListInfinityQueryOptions(),
    enabled: enabled,
  });

  const cursorRef = useIntersection(() => {
    fetchNextPage();
  });

  const cursor = (
    <div className="flex gap-2 mt4" ref={cursorRef}>
      {!hasNextPage && <div>Нет данных для загрузки</div>}
      {isFetchingNextPage && <div>Loading...</div>}
    </div>
  );

  return {
    error,
    data,
    isLoading,
    cursor,
    isPlaceholderData,
  };
}
