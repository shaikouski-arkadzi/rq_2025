type Todo = {
  id: string;
  text: string;
  done: boolean;
};

const BASE_URL = "http://localhost:3000";

// signal can cancel request
export const getTasks = ({ signal }: { signal: AbortSignal }) => {
  return fetch(`${BASE_URL}/tasks`, { signal }).then(
    (res) => res.json() as Promise<Todo[]>
  );
};

export default getTasks;
