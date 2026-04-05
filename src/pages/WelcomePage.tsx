import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Small header */}
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">
          {/* Left side */}
          <div className="text-center md:text-left">
            <div className="mb-6">
              <span className="text-5xl sm:text-6xl block mb-4 animate-bounce-pixel">🎮</span>
              <h1 className="font-pixel text-primary text-sm sm:text-lg leading-relaxed">
                Study Quest
              </h1>
              <p className="font-pixel-body text-xl sm:text-2xl text-foreground mt-4 leading-relaxed">
                Level up your study game! Track tasks, build streaks, and conquer your goals — RPG style.
              </p>
            </div>

            <p className="text-muted-foreground text-lg mb-8 font-pixel-body leading-relaxed">
              📋 Manage tasks with priorities & categories<br />
              🔥 Build daily completion streaks<br />
              📅 Calendar & weekly planner views<br />
              🏆 Track your progress like a pro
            </p>

            <div className="flex gap-3 justify-center md:justify-start">
              <button
                onClick={() => navigate("/auth?mode=register")}
                className="px-6 py-3 bg-primary text-primary-foreground font-pixel text-[9px] sm:text-[10px] pixel-btn"
              >
                ▶ SIGN UP
              </button>
              <button
                onClick={() => navigate("/auth?mode=login")}
                className="px-6 py-3 bg-secondary text-secondary-foreground font-pixel text-[9px] sm:text-[10px] pixel-btn"
              >
                ▶ LOG IN
              </button>
            </div>
          </div>

          {/* Right side - placeholder for demo image */}
          <div className="hidden md:flex items-center justify-center">
            <div className="pixel-border-lg bg-card p-8 w-full max-w-sm aspect-square flex flex-col items-center justify-center">
              <span className="text-6xl mb-4">🏰</span>
              <p className="font-pixel text-[8px] text-muted-foreground text-center leading-relaxed">
                DEMO IMAGE<br />PLACEHOLDER
              </p>
              <div className="mt-4 flex gap-2">
                <span className="text-2xl">⚔️</span>
                <span className="text-2xl">📚</span>
                <span className="text-2xl">🌟</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center p-4">
        <p className="font-pixel text-[7px] text-muted-foreground">
          © 2026 STUDY QUEST — PRESS START TO BEGIN
        </p>
      </footer>
    </div>
  );
}
