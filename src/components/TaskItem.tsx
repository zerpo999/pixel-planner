import { Task } from "@/types";
import { useApp } from "@/context/AppContext";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
}

const priorityStyles: Record<string, string> = {
  low: "border-l-yellow-400",
  medium: "border-l-orange-400",
  high: "border-l-red-400",
};

export default function TaskItem({ task, onEdit }: Props) {
  const { completeTask } = useApp();

  const isOverdue = !task.completed && new Date(task.due_date) < new Date(new Date().toISOString().split("T")[0]);

  return (
    <div
      className={`pixel-border bg-card p-3 flex items-center gap-3 border-l-4 ${priorityStyles[task.priority]} ${
        task.completed ? "opacity-60" : ""
      }`}
      style={{ borderLeftColor: task.color }}
    >
      <button
        onClick={() => !task.completed && completeTask(task.id)}
        disabled={task.completed}
        className={`w-6 h-6 pixel-border flex-shrink-0 flex items-center justify-center text-sm ${
          task.completed ? "bg-secondary" : "bg-muted hover:bg-primary/20"
        }`}
      >
        {task.completed ? "✓" : ""}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`font-pixel-body text-lg text-foreground truncate ${task.completed ? "line-through" : ""}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="font-pixel text-[7px] text-muted-foreground">{task.category}</span>
          <span className={`font-pixel text-[7px] ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
            📅 {task.due_date}
          </span>
          {isOverdue && <span className="font-pixel text-[7px] text-destructive animate-blink">⚠️ OVERDUE</span>}
        </div>
      </div>

      <button
        onClick={() => onEdit(task)}
        className="px-2 py-1 bg-muted text-muted-foreground font-pixel text-[7px] pixel-btn hover:text-foreground"
      >
        ✏️
      </button>
    </div>
  );
}
