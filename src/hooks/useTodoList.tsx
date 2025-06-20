import { useQuery } from "@tanstack/react-query";
import { todoListApi } from "../api/todoListApi";

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
  } = useQuery({
    ...todoListApi.getTasksListQueryOptions(),
    enabled: enabled,
    select: (data) => [...data].reverse(),
  });

  return {
    error,
    data,
    isLoading,
    isPlaceholderData,
  };
}
