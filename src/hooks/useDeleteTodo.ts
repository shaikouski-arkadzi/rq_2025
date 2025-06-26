import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoListApi } from "../api/todoListApi";

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  const deleteTodoMutation = useMutation({
    mutationFn: todoListApi.deleteTodo,
    onSettled() {
      queryClient.invalidateQueries({ queryKey: [todoListApi.baseKey] });
    },
    // data - результат запроса
    // variables - то что передаем в мутацию. В этом случае id
    async onSuccess(data, deletedId) {
      // вручную удаляем данные из кэша
      queryClient.setQueryData(
        todoListApi.getTasksListQueryOptions().queryKey,
        (todos) => todos?.filter((item) => item.id !== deletedId)
      );
    },
  });

  return {
    handleDelete: deleteTodoMutation.mutate,
    getIsPending: (id: string) =>
      deleteTodoMutation.isPending && deleteTodoMutation.variables === id,
  };
}
