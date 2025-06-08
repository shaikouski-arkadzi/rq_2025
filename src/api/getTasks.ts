type Todo = {
  id: string;
  text: string;
  done: boolean;
};

// mock get request
export const getTasks = () => {
  return new Promise<Todo[]>((res) => {
    setTimeout(() => {
      res([
        { id: "1", text: "task 1", done: false },
        { id: "2", text: "task 2", done: false },
      ]);
    }, 1000);
  });
};

export default getTasks;
