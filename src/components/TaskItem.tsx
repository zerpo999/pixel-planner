import { Task } from "@/types";
import { useApp } from "@/context/AppContext";
import { Checkbox, CheckboxOn, WarningDiamond } from 'pixelarticons/react';

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
  const { updateTask } = useApp(); // ← FIXED

  const isOverdue =
    !task.completed &&
    new Date(task.due_date) < new Date(new Date().toISOString().split("T")[0]);

  return (
    <div
      className={`pixel-border bg-card p-3 flex items-center gap-3 border-l-4 ${
        priorityStyles[task.priority]
      } ${task.completed ? "opacity-60" : ""}`}
      style={{ borderLeftColor: task.color }}
    >
      {/* Checkbox — FIXED */}
      <button
        onClick={() => updateTask(task.id, { completed: !task.completed })}
        className={"flex items-center justify-center text-xs"}
      >
        {task.completed ? <CheckboxOn /> : <Checkbox />}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`font-pixel-body text-lg text-foreground truncate ${
            task.completed ? "line-through" : ""
          }`}
        >
          {task.title}
        </p>

        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="font-pixel text-[7px] text-muted-foreground">
            {task.category}
          </span>
          <span> | </span>

          <span
            className={`font-pixel text-[7px] ${
              isOverdue ? "text-destructive" : "text-muted-foreground"
            }`}
          >
           Due: {task.due_date}
          </span>

          {isOverdue && (
            <>
            <span className="font-pixel text-[7px] text-destructive">
               OVERDUE
            </span>
             <span className="text-destructive">
              <WarningDiamond/> 
            </span>
            </>
          )}
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