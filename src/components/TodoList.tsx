import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import getTasks from "../api/getTasks";

const TodoList = () => {
  const [page, setPage] = useState(1);

  //queryKey - массив строк для различия запросов друг от друга
  //queryFn - любая асинхронная функция, которая возвращает промис
  const { data, error, isPending, isPlaceholderData } = useQuery({
    queryKey: ["todos", { page }],
    queryFn: (meta) => getTasks({ page }, meta), // meta будет включать сигнал
    // placeholderData - данные которые показываются пока ничего нету
    placeholderData: keepPreviousData, // показать предыдущие данные пока нет никаких данных
  });

  if (isPending) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>error: {JSON.stringify(error)}</div>;
  }

  return (
    <div className="p-5 mx-auto max-w-[1200px] mt-10">
      <h1 className="text-3xl font-bold mb-5">Todo List</h1>
      <div
        className={
          "flex flex-col gap-4 mb-5" + (isPlaceholderData ? " opacity-50" : "")
        }
      >
        {data.data.map((todo) => (
          <div className="border border-slate-300 rounded p-3" key={todo.id}>
            {todo.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="p-3 rounded border border-teal-500 uppercase"
        >
          prev
        </button>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, data.pages))}
          className="p-3 rounded border border-teal-500 uppercase"
        >
          next
        </button>
      </div>
    </div>
  );
};

export default TodoList;
