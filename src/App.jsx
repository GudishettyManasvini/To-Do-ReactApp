import { useState, useEffect } from "react";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/todos/all`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add new task
  const addTask = async () => {
    if (!taskInput.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/todos/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ task: taskInput })
      });

      const newTask = await res.json();
      setTasks([...tasks, newTask]);
      setTaskInput("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // Delete task (mark as done)
  const deleteTask = async (id) => {
    try {
      await fetch(`${API_BASE}/todos/done/${id}`, {
        method: "DELETE"
      });

      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="app">
      <h1>📝 To-Do List</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Add new task..."
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.task}
            <button onClick={() => deleteTask(task._id)}>➖</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
