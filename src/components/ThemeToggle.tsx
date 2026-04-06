import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
  onClick={toggleTheme}
  className="px-2 py-1 font-pixel text-[8px] sm:text-[9px] pixel-btn bg-muted text-foreground flex items-center gap-1"
  title="Toggle theme"
>
  {theme === "dark" ? (
    <>
      <img src="/sun.png" alt="Day" className="h-3 w-3" />
      DAY
    </>
  ) : (
    <>
      <img src="/moon.png" alt="Night" className="h-3 w-3" />
      NIGHT
    </>
  )}
</button>
  );
}
