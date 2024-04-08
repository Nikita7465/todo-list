import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { displayAllTasks, updateTasks } from "./store/reducers/tasks.reducer";
import axios from "axios";
import Cookies from "js-cookie";
import ThemeProvider from "./providers/ThemeProvider";
import Register from "./pages/register/Register";
import Auth from "./pages/auth/Auth";
import Tasks from "./pages/tasks/Tasks";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = Cookies.get("user_id");
  const token = Cookies.get("token");

  useEffect(() => {
    if (
      !token &&
      location.pathname !== "/register" &&
      location.pathname !== "/auth"
    ) {
      navigate("/auth");
    } else if (token && location.pathname !== "/tasks") {
      navigate("/tasks");
    }
  }, [token, navigate]);

  const getTasks = async () => {
    try {
      const response = await axios.post("http://localhost:3000/get-tasks", {
        userId,
      });

      if (response.status === 200) {
        dispatch(updateTasks(response.data.tasks));
        dispatch(displayAllTasks());
      }
    } catch (error) {
      throw new Error("Error getting task");
    }
  };

  if (token) {
    getTasks();
  }

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
