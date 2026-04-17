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
              {/* <span className=" block mb-4"><img src="/logo.png" alt="Pixel Planner Logo" className="h-16 w-16 object-contain mx-auto md:mx-3"/></span> */}
              <h1 className="font-pixel text-primary text-sm sm:text-xl leading-relaxed">
                Pixel Planner
              </h1>
              <p className="font-pixel-body text-xl sm:text-2xl text-foreground mt-4 leading-relaxed">
                Level up your study game! 
              </p>
            </div>

            <p className="text-muted-foreground text-lg mb-8 font-pixel-body leading-relaxed">
              📋 Manage tasks with priorities & categories<br />
              🔥 Build daily completion streaks<br />
              📅 Calendar & weekly planner views<br />
              🏆 Track your progress
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

          {/* Right side demo image */}
          <div className="hidden md:flex items-center justify-center">
            <div>
              <img src="/demo.png" alt="Pixel Planner Demo" className="w-full h-full object-contain border pixel-border rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center p-4">
        <p className="font-pixel text-[7px] text-muted-foreground">
          © 2026 PIXEL PLANNER
        </p>
      </footer>
    </div>
  );
}
