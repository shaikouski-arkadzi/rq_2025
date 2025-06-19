import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoListApi } from "../api/todoListApi";

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  const deleteTodoMutation = useMutation({
    mutationFn: todoListApi.deleteTodo,
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    // data - результат запроса
    // variables - то что передаем в мутацию. В этом случае id
    async onSuccess(data, deletedId) {
      // берем данные в кэше по такому же ключу как мы получали данные
      const todos = queryClient.getQueryData(
        todoListApi.getTasksListInfinityQueryOptions().queryKey
      ); // получаем закэшированные todo
      if (todos)
        // вручную удаляем данные из кэша
        queryClient.setQueryData(
          todoListApi.getTasksListInfinityQueryOptions().queryKey,
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                data: page.data.filter((item) => item.id !== deletedId),
              })),
            };
          }
        );
    },
  });

  return {
    handleDelete: deleteTodoMutation.mutate,
    getIsPending: (id: string) =>
      deleteTodoMutation.isPending && deleteTodoMutation.variables === id,
  };
}
