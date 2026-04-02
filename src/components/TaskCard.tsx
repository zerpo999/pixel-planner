import { Task, useApp } from "@/context/AppContext";

const priorityConfig = {
  low: { emoji: "🟢", label: "LOW", color: "border-l-mint" },
  medium: { emoji: "🟡", label: "MED", color: "border-l-accent" },
  high: { emoji: "🔴", label: "HIGH", color: "border-l-destructive" },
};

export default function TaskCard({ task }: { task: Task }) {
  const { completeTask, deleteTask } = useApp();
  const p = priorityConfig[task.priority];
  const isOverdue = !task.completed && new Date(task.due_date) < new Date();
  const dueDate = new Date(task.due_date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={`pixel-border bg-card p-3 sm:p-4 border-l-4 ${p.color} ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm">{p.emoji}</span>
            <h3
              className={`font-pixel text-[9px] sm:text-[10px] text-foreground leading-relaxed ${
                task.completed ? "line-through" : ""
              }`}
            >
              {task.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 mt-2 flex-wrap">
            <span className="text-muted-foreground text-xs sm:text-sm">
              📅 {dueDate}
            </span>
            <span className="font-pixel text-[7px] px-2 py-0.5 bg-muted text-muted-foreground">
              {p.label}
            </span>
            {isOverdue && (
              <span className="font-pixel text-[7px] px-2 py-0.5 bg-destructive text-destructive-foreground animate-blink">
                OVERDUE!
              </span>
            )}
            {task.completed && (
              <span className="font-pixel text-[7px] px-2 py-0.5 bg-secondary text-secondary-foreground">
                ✓ DONE
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          {!task.completed && (
            <button
              onClick={() => completeTask(task.id)}
              className="px-2 py-1 bg-secondary text-secondary-foreground font-pixel text-[7px] sm:text-[8px] pixel-btn"
              title="Complete"
            >
              ✓
            </button>
          )}
          <button
            onClick={() => deleteTask(task.id)}
            className="px-2 py-1 bg-destructive text-destructive-foreground font-pixel text-[7px] sm:text-[8px] pixel-btn"
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
