import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import TaskItem from "@/components/TaskItem";
import AddEditTaskDialog from "@/components/AddEditTaskDialog";
import { Task } from "@/types";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const { user, tasks, streak, updateTask} = useApp();
  const [showDialog, setShowDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const today = new Date().toISOString().split("T")[0];
  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);
  const weekEnd = weekFromNow.toISOString().split("T")[0];

  const dueToday = useMemo(() => tasks.filter((t) => t.due_date === today && !t.completed), [tasks, today]);
  const thisWeek = useMemo(
    () => tasks.filter((t) => t.due_date > today && t.due_date <= weekEnd && !t.completed)
      .sort((a, b) => a.due_date.localeCompare(b.due_date)),
    [tasks, today, weekEnd]
  );
  const overdue = useMemo(() => tasks.filter((t) => t.due_date < today && !t.completed), [tasks, today]);

  const streakAtRisk = streak.last_completed_date !== today;

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowDialog(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto p-3 sm:p-4 max-w-4xl">
        {/* Greeting */}
        <div className="mb-4">
          <h2 className="font-pixel text-primary text-[10px] sm:text-xs">
            {getGreeting()}, {user?.fullName || user?.username}!
          </h2>
        </div>

        {/* Stats row and add button box */}
        <div className="flex items-center justify-between w-full">
            <button
            onClick={() => { setEditingTask(null); setShowDialog(true); }}
            className="pixel-border flex items-center gap-2 px-3 py-0.5 bg-primary text-primary-foreground font-pixel text-[9px] pixel-btn"
          >
            <img src="/plus.png" alt="add" className="h-8 w-8" /> NEW TASK
          </button>
          <div className={`pixel-border flex items-center gap-2 px-2 py-1 ${streakAtRisk ? "bg-destructive/20" : "bg-secondary/20"}`}>
              <img src="/fire.png" alt="Fire" className="h-8 w-8" />
              <span className="font-pixel text-[10px] text-muted-foreground">STREAK: </span>
              <span className="font-pixel text-[12px] text-foreground">{streak.current}</span>
              {streakAtRisk && (
                <p className="font-pixel text-[6px] text-destructive ">AT RISK!</p>
              )}
          </div>
          {/* <div className="pixel-border bg-primary/10 p-3 text-center">
            <span className="text-xl">📋</span>
            <p className="font-pixel text-foreground text-sm sm:text-lg mt-1">{tasks.length}</p>
            <p className="font-pixel text-[7px] text-muted-foreground">TOTAL</p>
          </div>
          <div className="pixel-border bg-secondary/20 p-3 text-center">
            <span className="text-xl">✅</span>
            <p className="font-pixel text-foreground text-sm sm:text-lg mt-1">{tasks.filter((t) => t.completed).length}</p>
            <p className="font-pixel text-[7px] text-muted-foreground">DONE</p>
          </div>
          <div className={`pixel-border p-3 text-center ${overdue.length > 0 ? "bg-destructive/20" : "bg-accent/20"}`}>
            <span className="text-xl">{overdue.length > 0 ? "⚠️" : "⏰"}</span>
            <p className="font-pixel text-foreground text-sm sm:text-lg mt-1">
              {overdue.length > 0 ? overdue.length : tasks.filter((t) => !t.completed).length}
            </p>
            <p className="font-pixel text-[7px] text-muted-foreground">
              {overdue.length > 0 ? "OVERDUE" : "ACTIVE"}
            </p>
          </div> */}
        </div>
        <br />

        {/* Due Today */}
        <section className="mb-6">
          <h3 className="font-pixel text-[9px] text-foreground mb-2">DUE TODAY</h3>
          {dueToday.length === 0 ? (
            <div className="pixel-border bg-card p-4 text-center">
              <p className="font-pixel text-[8px] text-muted-foreground">No tasks due today</p>
            </div>
          ) : (
            <div className="space-y-2">
              {dueToday.map((t) => <TaskItem key={t.id} task={t} onEdit={handleEdit} />)}
            </div>
          )}
        </section>

        {/* This Week */}
        <section className="mb-6">
          <h3 className="font-pixel text-[9px] text-foreground mb-2">THIS WEEK</h3>
          {thisWeek.length === 0 ? (
            <div className="pixel-border bg-card p-4 text-center">
              <p className="font-pixel text-[8px] text-muted-foreground">All clear for this week</p>
            </div>
          ) : (
            <div className="space-y-2">
              {thisWeek.map((t) => <TaskItem key={t.id} task={t} onEdit={handleEdit} />)}
            </div>
          )}
        </section>

        {/* Progress Summary */}
        <section className="pixel-border-lg bg-card p-4 sm:p-5">
          <h3 className="font-pixel text-[9px] text-primary mb-3">PROGRESS SUMMARY</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-pixel-body text-lg">
            <div>
              <p className="font-pixel text-[7px] text-muted-foreground mb-1">Overdue</p>
              <p className={`text-xl ${overdue.length > 0 ? "text-destructive" : "text-foreground"}`}>
                {overdue.length}
              </p>
            </div>
            <div>
              <p className="font-pixel text-[7px] text-muted-foreground mb-1">Longest Streak</p>
              <p className="text-xl text-foreground"> <img src="/fire.png" alt="Fire" className="h-10 w-10 text-center" /> {streak.longest}</p>
            </div>
            <div>
              <p className="font-pixel text-[7px] text-muted-foreground mb-1">Current Streak</p>
              <p className="text-xl text-foreground justify-center"> <img src="/fire.png" alt="Fire" className="h-10 w-10 text-center justify-center" /> {streak.current}</p>
            </div>
            <div>
              <p className="font-pixel text-[7px] text-muted-foreground mb-1">Last Completed</p>
              <p className="text-xl text-foreground">{streak.last_completed_date || "—"}</p>
            </div>
          </div>
        </section>
      </div>

      <AddEditTaskDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        editTask={editingTask}
      />
    </div>
  );
}
