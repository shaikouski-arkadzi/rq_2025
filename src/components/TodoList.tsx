import { useState } from "react";
import { useTodoList } from "../hooks/useTodoList";
import { useCreateTodo } from "../hooks/useCreateTodo";

const TodoList = () => {
  const [enabled, setEnabled] = useState(false);
  const { data, error, isLoading, isPlaceholderData, cursor } =
    useTodoList(enabled);

  const { handleCreate, isPending } = useCreateTodo();

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

      <form className="flex gap-2 mb-5" onSubmit={handleCreate}>
        <input
          className="rounded p-2 border border-teal-500"
          type="text"
          name="text"
        />
        <button
          disabled={isPending}
          className="rounded p-2 border border-teal-500 disabled:opacty-50"
        >
          Создать
        </button>
      </form>

      <button
        className="text-blue-300 mb-2"
        onClick={() => setEnabled((e) => !e)}
      >
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
      {cursor}
    </div>
  );
};

export default TodoList;
