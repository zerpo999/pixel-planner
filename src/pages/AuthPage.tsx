import { useState } from "react";
import { useApp } from "@/context/AppContext";

export default function AuthPage() {
  const { login, register } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Fill in all fields!");
      return;
    }
    if (isLogin) {
      if (!login(username, password)) setError("Invalid credentials!");
    } else {
      if (!register(username, password)) setError("Username already taken!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md pixel-border-lg bg-card p-6 sm:p-8">
        <div className="text-center mb-8">
          <span className="text-3xl sm:text-4xl">🎮</span>
          <h1 className="font-pixel text-primary text-xs sm:text-sm mt-4 leading-relaxed">
            Study Quest
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Level up your study game!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-pixel text-[10px] text-foreground block mb-2">
              👤 Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-muted text-foreground pixel-border text-lg font-pixel-body outline-none focus:border-primary"
              placeholder="hero_name"
            />
          </div>
          <div>
            <label className="font-pixel text-[10px] text-foreground block mb-2">
              🔑 Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-muted text-foreground pixel-border text-lg font-pixel-body outline-none focus:border-primary"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-destructive font-pixel text-[8px] leading-relaxed">
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground font-pixel text-[10px] pixel-btn"
          >
            {isLogin ? "▶ LOG IN" : "▶ SIGN UP"}
          </button>
        </form>

        <button
          onClick={() => { setIsLogin(!isLogin); setError(""); }}
          className="w-full mt-4 text-center text-muted-foreground font-pixel text-[8px] hover:text-primary transition-colors"
        >
          {isLogin ? "New player? SIGN UP" : "Returning? LOG IN"}
        </button>
      </div>
    </div>
  );
}
