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
    <div>
      Todo List
      {data.map((todo) => (
        <div key={todo.id}>{todo.text}</div>
      ))}
    </div>
  );
};

export default TodoList;
