import { useState } from "react";
import { useApp, Task } from "@/context/AppContext";

export default function AddTaskForm({ onClose }: { onClose: () => void }) {
  const { addTask } = useApp();
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;
    addTask(title.trim(), dueDate, priority);
    onClose();
  };

  return (
    <div className="pixel-border-lg bg-card p-4 sm:p-6 mb-4">
      <h2 className="font-pixel text-primary text-[9px] sm:text-[10px] mb-4">
        📜 New Quest
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="font-pixel text-[8px] text-foreground block mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-muted text-foreground pixel-border text-base font-pixel-body outline-none focus:border-primary"
            placeholder="Study for math exam..."
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-pixel text-[8px] text-foreground block mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-muted text-foreground pixel-border text-base font-pixel-body outline-none focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="font-pixel text-[8px] text-foreground block mb-1">Priority</label>
            <div className="flex gap-1">
              {(["low", "medium", "high"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 font-pixel text-[7px] sm:text-[8px] pixel-btn ${
                    priority === p
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {p === "low" ? "🟢" : p === "medium" ? "🟡" : "🔴"} {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 py-2 bg-primary text-primary-foreground font-pixel text-[8px] sm:text-[9px] pixel-btn"
          >
            ✦ ADD QUEST
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-muted text-muted-foreground font-pixel text-[8px] sm:text-[9px] pixel-btn"
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}
