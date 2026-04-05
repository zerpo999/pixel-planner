import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";

export default function HistoryPage() {
  const { tasks } = useApp();

  const completedTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.completed)
        .sort((a, b) => (b.completed_at || "").localeCompare(a.completed_at || "")),
    [tasks]
  );

  const priorityColors: Record<string, string> = {
    high: "text-destructive",
    medium: "text-accent",
    low: "text-secondary",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-3 sm:p-4 max-w-4xl">
        <h2 className="font-pixel text-primary text-[10px] sm:text-xs mb-4">TASK HISTORY</h2>

        {completedTasks.length === 0 ? (
          <div className="pixel-border-lg bg-card p-8 text-center">
            <p className="font-pixel text-[8px] text-muted-foreground mt-4">
              No completed quests yet. 
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <div key={task.id} className="pixel-border bg-card p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-secondary text-lg flex-shrink-0">✅</span>
                  <div className="min-w-0">
                    <p className="font-pixel-body text-foreground text-lg truncate">{task.title}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-pixel text-[7px] text-muted-foreground">{task.category}</span>
                      <span className={`font-pixel text-[7px] ${priorityColors[task.priority]}`}>
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-pixel text-[7px] text-muted-foreground">COMPLETED</p>
                  <p className="font-pixel-body text-sm text-foreground">
                    {task.completed_at
                      ? new Date(task.completed_at).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
