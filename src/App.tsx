import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/queryClient";
import TodoList from "./components/TodoList";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoList />
    </QueryClientProvider>
  );
}

export default App;
