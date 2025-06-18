import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/queryClient";
import TodoList from "./components/TodoList";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { store } from "./utils/redux";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <TodoList />
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
