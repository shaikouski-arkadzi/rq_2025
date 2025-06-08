import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/queryClient";
import TodoList from "./components/TodoList";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoList />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
