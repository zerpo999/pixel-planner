import { useApp } from "@/context/AppContext";

export default function Notifications() {
  const { tasks, streak } = useApp();
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const today = now.toISOString().split("T")[0];

  const dueSoon = tasks.filter(
    (t) => !t.completed && new Date(t.due_date) <= in24h && new Date(t.due_date) >= now
  );

  const streakAtRisk = streak.current > 0 && streak.last_completed_date !== today;

  if (dueSoon.length === 0 && !streakAtRisk) return null;

  return (
    <div className="mb-4 space-y-2">
      {streakAtRisk && (
        <div className="pixel-border bg-peach bg-opacity-40 p-2 sm:p-3 flex items-center gap-2">
          <span className="animate-blink text-lg">⚡</span>
          <p className="font-pixel text-[8px] sm:text-[9px] text-foreground leading-relaxed">
            Streak at risk! Complete a quest today to keep your {streak.current}-day streak!
          </p>
        </div>
      )}
      {dueSoon.length > 0 && (
        <div className="pixel-border bg-accent bg-opacity-40 p-2 sm:p-3 flex items-center gap-2">
          <span className="text-lg">⏰</span>
          <p className="font-pixel text-[8px] sm:text-[9px] text-foreground leading-relaxed">
            {dueSoon.length} quest{dueSoon.length > 1 ? "s" : ""} due within 24 hours!
          </p>
        </div>
      )}
    </div>
  );
}
