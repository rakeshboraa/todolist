"use client";
import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("active"); // "active", "archived", or "important"

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAdd = (title) => {
    const newTask = {
      id: uuidv4(),
      title,
      completed: false,
      important: false,
      archived: false,
    };
    setTasks([newTask, ...tasks]);
  };

  const handleUpdate = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleClearAll = () => {
    setTasks([]);
    localStorage.removeItem("tasks");
  };

  // Filter tasks based on the current view
  const visibleTasks = tasks.filter((task) => {
    if (view === "active") return !task.archived;
    if (view === "archived") return task.archived;
    if (view === "important") return task.important && !task.archived;
    return true;
  });

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-center text-lg sm:text-xl font-semibold mb-6">
        Rakesh Bora 📝 To-Do List
      </h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3 sm:gap-0">
        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          <button
            onClick={() => setView("active")}
            className={`px-3 py-1 rounded text-sm sm:text-base ${
              view === "active"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-blue-100"
            }`}
          >
            Active Tasks
          </button>

          <button
            onClick={() => setView("important")}
            className={`px-3 py-1 rounded text-sm sm:text-base ${
              view === "important"
                ? "bg-yellow-400 text-white"
                : "bg-gray-200 hover:bg-yellow-100"
            }`}
          >
            Important Tasks
          </button>

          <button
            onClick={() => setView("archived")}
            className={`px-3 py-1 rounded text-sm sm:text-base ${
              view === "archived"
                ? "bg-gray-700 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Archived Tasks
          </button>

          {tasks.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Only show add form when viewing active tasks */}
      {view === "active" && <TaskForm onAdd={handleAdd} />}

      <div className="mt-6 space-y-3">
        {visibleTasks.length === 0 && (
          <p className="text-gray-500 text-center">
            {view === "archived"
              ? "No archived tasks."
              : view === "important"
              ? "No important tasks."
              : "No tasks yet."}
          </p>
        )}
        {visibleTasks.map((task) => (
          <TaskItem key={task.id} task={task} onUpdate={handleUpdate} />
        ))}
      </div>
    </main>
  );
}
