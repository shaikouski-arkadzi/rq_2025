import { v4 as uuidv4 } from "uuid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoListApi } from "../api/todoListApi";

export function useCreateTodo() {
  const queryClient = useQueryClient();

  const createTodoMutation = useMutation({
    mutationFn: todoListApi.createTodo,
    async onSuccess() {
      //invalidate помечает все запросы которые подходят по ключу как stale и перезапрашивает
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const text = String(formData.get("text") ?? "");

    createTodoMutation.mutate({
      id: uuidv4(),
      done: false,
      text: text,
      userId: "1",
    });

    e.currentTarget.reset();
  };

  return {
    handleCreate,
    isPending: createTodoMutation.isPending,
  };
}
