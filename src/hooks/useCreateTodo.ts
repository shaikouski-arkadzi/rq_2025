import { useAppDispatch } from "../utils/redux";
import { createTodoThunk, useCreateLoading } from "../utils/createTodo.thunk";

export function useCreateTodo() {
  const appDispatch = useAppDispatch();

  const isCreateLoading = useCreateLoading();

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const text = String(formData.get("text") ?? "");

    appDispatch(createTodoThunk(text));

    e.currentTarget.reset();
  };

  return {
    handleCreate,
    isCreateLoading,
  };
}
