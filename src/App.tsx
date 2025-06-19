import Login from "./components/Login";
import TodoList from "./components/TodoList";
import { useUser } from "./hooks/useUser";
import { logoutThunk } from "./utils/logout-thunk";
import { useAppDispatch } from "./utils/redux";

function App() {
  const { data, isLoading } = useUser();
  const dispatch = useAppDispatch();

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (data) {
    return (
      <>
        <button
          onClick={() => dispatch(logoutThunk())}
          className="border border-rose-500 p-3 rounded"
        >
          Выход
        </button>
        <TodoList />
      </>
    );
  }

  return <Login />;
}

export default App;
