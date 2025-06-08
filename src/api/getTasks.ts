type Todo = {
  id: string;
  text: string;
  done: boolean;
};

type PaginatedResult<T> = {
  data: T[];
  first: number;
  items: number;
  last: number;
  next: number | null;
  pages: number;
  prev: number | null;
};

const BASE_URL = "http://localhost:3000";

// signal can cancel request
export const getTasks = (
  { page }: { page: number },
  { signal }: { signal: AbortSignal }
) => {
  return fetch(`${BASE_URL}/tasks?_page=${page}&_per_page=10`, { signal }).then(
    (res) => res.json() as Promise<PaginatedResult<Todo>>
  );
};

export default getTasks;
