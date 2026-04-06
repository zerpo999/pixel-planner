import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import AddEditTaskDialog from "@/components/AddEditTaskDialog";
import { Task } from "@/types";
import { Checkbox, CheckboxOn } from 'pixelarticons/react'

function getWeekDates(offset: number): { date: Date; dateStr: string; label: string }[] {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + offset * 7);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return {
      date: d,
      dateStr: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" }),
    };
  });
}

export default function WeeklyPlanner() {
  const { tasks, completeTask } = useApp();
  const [weekOffset, setWeekOffset] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const today = new Date().toISOString().split("T")[0];

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach((t) => {
      if (!map[t.due_date]) map[t.due_date] = [];
      map[t.due_date].push(t);
    });
    return map;
  }, [tasks]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-3 sm:p-4 max-w-5xl">
        {/* Week nav */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setWeekOffset((w) => w - 1)} className="px-3 py-1 font-pixel text-[9px] pixel-btn bg-muted text-foreground">
            ◀ PREV
          </button>
          <h2 className="font-pixel text-primary text-[10px] sm:text-xs">
            WEEKLY PLANNER {weekOffset === 0 ? "(THIS WEEK)" : ""}
          </h2>
          <button onClick={() => setWeekOffset((w) => w + 1)} className="px-3 py-1 font-pixel text-[9px] pixel-btn bg-muted text-foreground">
            NEXT ▶
          </button>
        </div>

        <button
          onClick={() => { setEditingTask(null); setShowDialog(true); }}
          className="flex items-center gap-2 px-2 py-0.5 bg-primary text-primary-foreground font-pixel text-[9px] pixel-btn"
        >
          <img src="/plus.png" alt="add" className="h-8 w-8" /> NEW TASK
        </button>
        <br />

        {/* Week grid */}
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
          {weekDates.map(({ dateStr, label }) => {
            const dayTasks = tasksByDate[dateStr] || [];
            const isToday = dateStr === today;

            return (
              <div
                key={dateStr}
                className={`pixel-border p-2 sm:p-3 min-h-[100px] ${
                  isToday ? "bg-primary/10 border-primary" : "bg-card"
                }`}
              >
                <p className={`font-pixel text-[7px] sm:text-[8px] mb-2 ${isToday ? "text-primary" : "text-foreground"}`}>
                  {label.toUpperCase()}
                </p>

                {dayTasks.length === 0 ? (
                  <p className="font-pixel text-[7px] text-muted-foreground">—</p>
                ) : (
                  <div className="space-y-1">
                    {dayTasks.map((t) => (
                      <div
                        key={t.id}
                        className={`p-1.5 text-[11px] font-pixel-body cursor-pointer ${
                          t.completed ? "line-through opacity-50" : ""
                        }`}
                        style={{ backgroundColor: t.color + "25", borderLeft: `3px solid ${t.color}` }}
                      >
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => !t.completed && completeTask(t.id)}
                            className="text-xs flex-shrink-0"
                          >
                            {t.completed ? <CheckboxOn /> : <Checkbox/>}
                          </button>
                          <span
                            className="truncate cursor-pointer hover:underline"
                            onClick={() => { setEditingTask(t); setShowDialog(true); }}
                          >
                            {t.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <AddEditTaskDialog open={showDialog} onClose={() => setShowDialog(false)} editTask={editingTask} />
    </div>
  );
}
