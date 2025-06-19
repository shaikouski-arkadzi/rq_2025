import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoListApi } from "../api/todoListApi";

export function useToggleTodo() {
  const queryClient = useQueryClient();

  const updateTodoMutation = useMutation({
    mutationFn: todoListApi.updateTodo,
    // во время вызова мутации
    onMutate: async (newTodo) => {
      // Отменяем все исходящие запросы
      // чтобы они не перезаписали наше оптимистичное обновление
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      // Получаем предыдущее значение из кэша
      const previousTodos = queryClient.getQueryData(["todos"]);

      // Дополняем предыдущее значение с новым
      queryClient.setQueryData(
        todoListApi.getTasksListInfinityQueryOptions().queryKey,
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((todo) =>
                todo.id === newTodo.id ? { ...todo, ...newTodo } : todo
              ),
            })),
          };
        }
      );

      // результат мутации возвращает объект
      // с измененным вручную значением
      return { previousTodos };
    },
    // Если мутация провалилась используем
    // контексный объект для отката
    onError: (err, newTodo, context) => {
      if (context) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
    },
    // Всегда перезапрашивем после ошибки или успеха
    async onSettled() {
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
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
