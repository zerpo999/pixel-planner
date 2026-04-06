import { useTheme } from "@/context/ThemeContext";
import{ Moon, Lightbulb } from 'pixelarticons/react';

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
      <Lightbulb className="h-3 w-3" />
      DAY
    </>
  ) : (
    <>
      <Moon className="h-3 w-3" />
      NIGHT
    </>
  )}
</button>
  );
}
