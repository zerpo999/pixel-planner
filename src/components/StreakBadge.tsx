import { useApp } from "@/context/AppContext";

export default function StreakBadge() {
  const { streak } = useApp();

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const isActive = streak.last_completed_date === today || streak.last_completed_date === yesterday;

  return (
    <div className="pixel-border bg-lavender bg-opacity-30 p-2 sm:p-3 text-center col-span-2 sm:col-span-1">
      <span className={`text-lg sm:text-xl ${isActive ? "animate-bounce-pixel" : ""}`}>
        🔥
      </span>
      <p className="font-pixel text-foreground text-sm sm:text-lg mt-1">
        {streak.current}
      </p>
      <p className="font-pixel text-[7px] text-muted-foreground">Streak</p>
    </div>
  );
}
