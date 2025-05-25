"use client"
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
    <main className=" mx-auto p-6">
      <h1 className="text-center">Rakesh Bora </h1>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📝 To-Do List</h1>

        <div className="flex space-x-2">
          <button
            onClick={() => setView("active")}
            className={`px-3 py-1 rounded ${
              view === "active" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Active Tasks
          </button>

          <button
            onClick={() => setView("important")}
            className={`px-3 py-1 rounded ${
              view === "important" ? "bg-yellow-400 text-white" : "bg-gray-200"
            }`}
          >
            Important Tasks
          </button>

          <button
            onClick={() => setView("archived")}
            className={`px-3 py-1 rounded ${
              view === "archived" ? "bg-gray-700 text-white" : "bg-gray-200"
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
          <p className="text-gray-500">
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
