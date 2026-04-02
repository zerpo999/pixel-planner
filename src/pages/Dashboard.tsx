import { useState } from "react";
import { useApp, Task } from "@/context/AppContext";
import TaskCard from "@/components/TaskCard";
import AddTaskForm from "@/components/AddTaskForm";
import StreakBadge from "@/components/StreakBadge";
import Notifications from "@/components/Notifications";

export default function Dashboard() {
  const { user, tasks, logout } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");

  const filtered = tasks
    .filter((t) => {
      if (filter === "active") return !t.completed;
      if (filter === "done") return t.completed;
      return true;
    })
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="pixel-border-lg bg-card p-3 sm:p-4 mx-2 sm:mx-4 mt-2 sm:mt-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-2xl">🎮</span>
          <h1 className="font-pixel text-primary text-[8px] sm:text-[10px]">Study Quest</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-muted-foreground text-sm sm:text-base">
            👤 {user?.username}
          </span>
          <button
            onClick={logout}
            className="px-2 sm:px-3 py-1 bg-destructive text-destructive-foreground font-pixel text-[7px] sm:text-[8px] pixel-btn"
          >
            EXIT
          </button>
        </div>
      </header>

      <div className="container mx-auto p-2 sm:p-4 max-w-4xl">
        <Notifications />

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
          <StreakBadge />
          <StatBox emoji="📋" label="Total" value={tasks.length} color="bg-sky" />
          <StatBox emoji="✅" label="Done" value={tasks.filter((t) => t.completed).length} color="bg-mint" />
          <StatBox emoji="⏰" label="Active" value={tasks.filter((t) => !t.completed).length} color="bg-peach" />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-3 sm:px-4 py-2 bg-primary text-primary-foreground font-pixel text-[8px] sm:text-[9px] pixel-btn"
          >
            {showForm ? "✕ CLOSE" : "＋ NEW QUEST"}
          </button>
          <div className="flex gap-1">
            {(["all", "active", "done"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 sm:px-3 py-1 font-pixel text-[7px] sm:text-[8px] pixel-btn ${
                  filter === f
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {showForm && <AddTaskForm onClose={() => setShowForm(false)} />}

        {/* Task list */}
        <div className="space-y-2 sm:space-y-3">
          {filtered.length === 0 ? (
            <div className="pixel-border bg-card p-6 sm:p-8 text-center">
              <span className="text-3xl sm:text-4xl block mb-3">🏰</span>
              <p className="font-pixel text-muted-foreground text-[8px] sm:text-[9px] leading-relaxed">
                No quests yet! Add one to start your adventure.
              </p>
            </div>
          ) : (
            filtered.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </div>
      </div>
    </div>
  );
}

function StatBox({ emoji, label, value, color }: { emoji: string; label: string; value: number; color: string }) {
  return (
    <div className={`pixel-border ${color} bg-opacity-30 p-2 sm:p-3 text-center`}>
      <span className="text-lg sm:text-xl">{emoji}</span>
      <p className="font-pixel text-foreground text-sm sm:text-lg mt-1">{value}</p>
      <p className="font-pixel text-[7px] text-muted-foreground">{label}</p>
    </div>
  );
}
