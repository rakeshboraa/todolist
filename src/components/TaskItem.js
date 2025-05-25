import { useState } from "react";

export default function TaskItem({ task, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);

    const toggleComplete = () => onUpdate({ ...task, completed: !task.completed });
    const toggleImportant = () => onUpdate({ ...task, important: !task.important });
    const toggleArchive = () => onUpdate({ ...task, archived: true });

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (editTitle.trim()) {
            onUpdate({ ...task, title: editTitle });
            setIsEditing(false);
        }
    };

    return (
        <div
            className={`flex items-center justify-between p-4 rounded-lg shadow-md bg-white transition-all duration-300 hover:shadow-lg border 
      ${task.archived ? "opacity-50 grayscale" : ""}`}
        >
            <div className="flex-1">
                {isEditing ? (
                    <form onSubmit={handleEditSubmit}>
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={handleEditSubmit}
                            autoFocus
                            className="border p-2 rounded w-full transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </form>
                ) : (
                    <h3
                        className={`font-medium break-words transition-all duration-300 ${task.completed ? "line-through text-gray-400" : ""
                            }`}
                    >
                        {task.title}
                    </h3>
                )}
            </div>

            <div className="flex space-x-2 items-center ml-4">
                <TooltipButton onClick={handleEdit} label="Edit Task" icon="✏️" />
                <TooltipButton
                    onClick={toggleComplete}
                    label={task.completed ? "Undo Complete" : "Mark Complete"}
                    color={task.completed ? "bg-green-100 text-green-600" : ""}
                    icon="✅"
                />
                <TooltipButton
                    onClick={toggleImportant}
                    label={task.important ? "Unmark Important" : "Mark Important"}
                    color={task.important ? "bg-yellow-100 text-yellow-600" : ""}
                    icon="⭐"
                />
                <TooltipButton onClick={toggleArchive} label="Archive Task" icon="🗃️" />
            </div>
        </div>
    );
}

function TooltipButton({ onClick, label, icon, color = "" }) {
    return (
        <div className="relative group">
            <button
                onClick={onClick}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-110 hover:bg-gray-100 ${color}`}
            >
                {icon}
            </button>
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all bg-gray-800 text-white text-xs px-2 py-1 rounded shadow z-10 whitespace-nowrap">
                {label}
            </span>
        </div>
    );
}
