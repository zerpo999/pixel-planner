import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import AddEditTaskDialog from "@/components/AddEditTaskDialog";
import { Task } from "@/types";

export default function CalendarPage() {
  const { tasks } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDialog, setShowDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toISOString().split("T")[0];

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach((t) => {
      if (!map[t.due_date]) map[t.due_date] = [];
      map[t.due_date].push(t);
    });
    return map;
  }, [tasks]);

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setShowDialog(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-3 sm:p-4 max-w-5xl">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="px-3 py-1 font-pixel text-[9px] pixel-btn bg-muted text-foreground">
            ◀ PREV
          </button>
          <h2 className="font-pixel text-primary text-[10px] sm:text-xs">{monthName.toUpperCase()}</h2>
          <button onClick={nextMonth} className="px-3 py-1 font-pixel text-[9px] pixel-btn bg-muted text-foreground">
            NEXT ▶
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
            <div key={d} className="text-center font-pixel text-[7px] text-muted-foreground p-1">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            if (day === null) return <div key={idx} className="min-h-[60px] sm:min-h-[80px]" />;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayTasks = tasksByDate[dateStr] || [];
            const isToday = dateStr === today;

            return (
              <div
                key={idx}
                className={`min-h-[60px] sm:min-h-[80px] pixel-border p-1 ${
                  isToday ? "bg-primary/15 border-primary" : "bg-card"
                }`}
              >
                <p className={`font-pixel text-[7px] sm:text-[8px] mb-1 ${isToday ? "text-primary" : "text-foreground"}`}>
                  {day}
                </p>
                <div className="space-y-0.5">
                  {dayTasks.slice(0, 3).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleTaskClick(t)}
                      className={`w-full text-left px-1 py-0.5 text-[10px] sm:text-xs font-pixel-body truncate ${
                        t.completed ? "line-through opacity-50" : ""
                      }`}
                      style={{ backgroundColor: t.color + "30", borderLeft: `3px solid ${t.color}` }}
                    >
                      {t.title}
                    </button>
                  ))}
                  {dayTasks.length > 3 && (
                    <p className="font-pixel text-[6px] text-muted-foreground">+{dayTasks.length - 3} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AddEditTaskDialog open={showDialog} onClose={() => setShowDialog(false)} editTask={editingTask} />
    </div>
  );
}
