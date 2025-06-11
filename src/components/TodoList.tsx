import { useState } from "react";
import { useTodoList } from "../hooks/useTodoList";

const TodoList = () => {
  const [enabled, setEnabled] = useState(false);
  const { data, error, isLoading, isPlaceholderData, cursor } =
    useTodoList(enabled);

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
      <button onClick={() => setEnabled((e) => !e)}>Toggle enabled</button>
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
