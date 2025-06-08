import { useQuery } from "@tanstack/react-query";
import getTasks from "../api/getTasks";

const TodoList = () => {
  //queryKey - массив строк для различия запросов друг от друга
  //queryFn - любая асинхронная функция, которая возвращает промис
  const { data, error, isPending } = useQuery({
    queryKey: ["todos"],
    queryFn: getTasks,
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
      <div className="flex flex-col gap-4">
        {data.map((todo) => (
          <div className="border border-slate-300 rounded p-3" key={todo.id}>
            {todo.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
