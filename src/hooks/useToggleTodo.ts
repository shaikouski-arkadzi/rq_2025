import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoListApi } from "../api/todoListApi";

export function useToggleTodo() {
  const queryClient = useQueryClient();

  const updateTodoMutation = useMutation({
    mutationFn: todoListApi.updateTodo,
    // во время вызова мутации
    onMutate: async (newTask) => {
      // Отменяем все исходящие запросы
      // чтобы они не перезаписали наше оптимистичное обновление
      await queryClient.cancelQueries({ queryKey: [todoListApi.baseKey] });

      // Получаем предыдущее значение из кэша
      const previousTodos = queryClient.getQueryData(
        todoListApi.getTasksListQueryOptions().queryKey
      );

      // Дополняем предыдущее значение с новым
      queryClient.setQueryData(
        todoListApi.getTasksListQueryOptions().queryKey,
        (oldData) =>
          oldData?.map((task) =>
            task.id === newTask.id ? { ...task, ...newTask } : task
          )
      );

      // результат мутации возвращает объект
      // с измененным вручную значением
      return { previousTodos };
    },
    // Если мутация провалилась используем
    // контексный объект для отката
    onError: (err, newTodo, context) => {
      if (context) {
        queryClient.setQueryData(
          todoListApi.getTasksListQueryOptions().queryKey,
          context.previousTodos
        );
      }
    },
    // Всегда перезапрашивем после ошибки или успеха
    async onSettled() {
      await queryClient.invalidateQueries({ queryKey: [todoListApi.baseKey] });
    },
  });

  const toggleTodo = (id: string, done: boolean) => {
    updateTodoMutation.mutate({
      id,
      done: !done,
    });
  };

  return {
    toggleTodo,
  };
}
