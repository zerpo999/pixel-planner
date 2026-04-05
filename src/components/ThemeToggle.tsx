import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="px-2 py-1 font-pixel text-[8px] sm:text-[9px] pixel-btn bg-muted text-foreground"
      title="Toggle theme"
    >
      {theme === "dark" ? "☀️ DAY" : "🌙 NIGHT"}
    </button>
  );
}
