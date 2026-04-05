import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Task } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  editTask?: Task | null;
}

const CATEGORIES = ["Study", "Homework", "Project", "Reading", "Review"];
const COLORS = ["#ff6b6b", "#ffa94d", "#ffd43b", "#69db7c", "#74c0fc", "#b197fc", "#f783ac"];

export default function AddEditTaskDialog({ open, onClose, editTask }: Props) {
  const { addTask, updateTask, deleteTask } = useApp();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Study");
  const [customCategory, setCustomCategory] = useState(""); // NEW
  const [color, setColor] = useState(COLORS[0]);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setCategory(editTask.category);
      setCustomCategory(""); // reset custom field
      setColor(editTask.color);
      setDueDate(editTask.due_date);
      setPriority(editTask.priority);
      setCompleted(editTask.completed);
    } else {
      setTitle("");
      setCategory("Study");
      setCustomCategory("");
      setColor(COLORS[0]);
      setDueDate(new Date().toISOString().split("T")[0]);
      setPriority("medium");
      setCompleted(false);
    }
  }, [editTask, open]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!title.trim() || !dueDate) return;

    const finalCategory =
      category === "__custom" ? customCategory.trim() : category;

    if (!finalCategory) return; // prevent empty custom category

    if (editTask) {
      await updateTask(editTask.id, {
        title,
        category: finalCategory,
        color,
        due_date: dueDate,
        priority,
        completed,
      });
    } else {
      await addTask({
        title,
        category: finalCategory,
        color,
        due_date: dueDate,
        priority,
      });
    }

    onClose();
  };

  const handleDelete = async () => {
    if (editTask) {
      await deleteTask(editTask.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md pixel-border-lg bg-card p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="font-pixel text-primary text-[10px] sm:text-xs mb-5">
          {editTask ? "✏️ EDIT TASK" : "✨ NEW TASK"}
        </h2>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="font-pixel text-[8px] text-foreground block mb-1">
              📝 Task Name
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-muted text-foreground pixel-border text-lg font-pixel-body outline-none focus:border-primary"
              placeholder="task name"
            />
          </div>

          {/* Category */}
          <div>
            <label className="font-pixel text-[8px] text-foreground block mb-1">
              📂 Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-muted text-foreground pixel-border text-lg font-pixel-body outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="__custom">➕ Custom...</option>
            </select>

            {category === "__custom" && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter custom category"
                className="mt-2 w-full px-3 py-2 bg-muted text-foreground pixel-border text-lg font-pixel-body outline-none"
              />
            )}
          </div>

          {/* Color */}
          <div>
            <label className="font-pixel text-[8px] text-foreground block mb-1">
              🎨 Label
            </label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 pixel-border ${
                    color === c ? "ring-2 ring-primary scale-110" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 pixel-border cursor-pointer"
              />
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="font-pixel text-[8px] text-foreground block mb-1">
              📅 Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-muted text-foreground pixel-border text-lg font-pixel-body outline-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="font-pixel text-[8px] text-foreground block mb-1">
              ⚡ Priority
            </label>
            <div className="flex gap-2">
              {(["low", "medium", "high"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 font-pixel text-[8px] pixel-btn ${
                    priority === p
                      ? p === "low"
                        ? "bg-yellow-400 text-yellow-900"
                        : p === "medium"
                        ? "bg-orange-400 text-orange-900"
                        : "bg-red-400 text-red-900"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Completed checkbox (edit only) */}
          {editTask && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                className="w-5 h-5 accent-primary"
              />
              <span className="font-pixel text-[8px] text-foreground">
                ✅ Completed
              </span>
            </label>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-6">
          {editTask && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-destructive text-destructive-foreground font-pixel text-[8px] pixel-btn"
            >
              🗑️ DELETE
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="px-4 py-2 bg-muted text-muted-foreground font-pixel text-[8px] pixel-btn"
          >
            CANCEL
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-primary-foreground font-pixel text-[8px] pixel-btn"
          >
            {editTask ? "💾 SAVE" : "✨ ADD"}
          </button>
        </div>
      </div>
    </div>
  );
}