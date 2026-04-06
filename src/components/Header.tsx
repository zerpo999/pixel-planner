import { useApp } from "@/context/AppContext";
import ThemeToggle from "./ThemeToggle";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "HOME" },
    { path: "/history", label: "TASK LIST" },
    { path: "/calendar", label: "CALENDAR" },
    { path: "/planner", label: "PLANNER" },
  ];

  return (
    <header className="pixel-border-lg bg-card p-3 sm:p-4 mx-2 sm:mx-4 mt-2 sm:mt-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-2xl cursor-pointer" onClick={() => navigate("/dashboard")}>
            <img src="logo.png" alt="Logo" className="w-8 h-8" />
          </span>
          <h1 className="font-pixel text-primary text-[12px] sm:text-[12px] hidden sm:block">Pixel Planner </h1>
        </div>

        {user && (
          <nav className="flex items-center gap-1 sm:gap-2 order-3 sm:order-2 w-full sm:w-auto justify-center">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-2 py-1 font-pixel text-[7px] sm:text-[8px] pixel-btn ${
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2 sm:gap-3 order-2 sm:order-3">
          <ThemeToggle />
          {user && (
            <>
              <div className="flex items-center gap-1">
                <span className="w-7 h-7 bg-muted pixel-border flex items-center justify-center text-sm">👤</span>
                <span className="text-muted-foreground text-sm hidden sm:inline">{user.username}</span>
              </div>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="px-2 sm:px-3 py-1 bg-destructive text-destructive-foreground font-pixel text-[7px] sm:text-[8px] pixel-btn"
              >
                LOG OUT
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
