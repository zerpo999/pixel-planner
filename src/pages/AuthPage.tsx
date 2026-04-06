import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

export default function AuthPage() {
  const { login, register } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "register");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const validatePassword = (pw: string): string[] => {
    const errs: string[] = [];
    if (pw.length < 8) errs.push("Must be at least 8 characters");
    if (!/\d/.test(pw)) errs.push("Must contain at least 1 number");
    if (!/[^a-zA-Z0-9]/.test(pw)) errs.push("Must contain at least 1 special character");
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    if (!username.trim()) {
      setErrors(["Username is required"]);
      return;
    }

    if (!isLogin) {
      if (!fullName.trim()) {
        setErrors(["Full name is required"]);
        return;
      }
      const pwErrors = validatePassword(password);
      if (pwErrors.length > 0) {
        setErrors(pwErrors);
        return;
      }
    }

    if (isLogin) {
      const ok = await login(username, password);
      if (!ok) {
        setErrors(["Invalid credentials!"]);
        return;
      }
    } else {
      const ok = await register(username, password, fullName);
      if (!ok) {
        setErrors(["Username already taken!"]);
        return;
      }
    }
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex justify-between items-center p-4">
        <button
          onClick={() => navigate("/")}
          className="font-pixel text-[8px] text-muted-foreground hover:text-foreground"
        >
          ← BACK
        </button>
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md pixel-border-lg bg-card p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="font-pixel text-primary text-xs sm:text-sm mt-4 leading-relaxed">
              {isLogin ? "Welcome Back!" : "Create Account"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="font-pixel text-[10px] text-foreground block mb-2">✨ Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-muted text-foreground pixel-border text-lg font-pixel-body outline-none focus:border-primary"
                  placeholder="Your Name"
                />
              </div>
            )}
            <div>
              <label className="font-pixel text-[10px] text-foreground block mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-muted text-foreground pixel-border text-lg font-pixel-body outline-none focus:border-primary"
                placeholder="user_name"
              />
            </div>
            <div>
              <label className="font-pixel text-[10px] text-foreground block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-muted text-foreground pixel-border text-lg font-pixel-body outline-none focus:border-primary"
                placeholder="password123!"
              />
              {!isLogin && (
                <div className="mt-2 space-y-1">
                  <p className="font-pixel text-[7px] text-muted-foreground">Requirements:</p>
                  <p className={`font-pixel text-[7px] ${password.length >= 8 ? "text-secondary" : "text-muted-foreground"}`}>
                    {password.length >= 8 ? "✅" : "○"} 8+ characters
                  </p>
                  <p className={`font-pixel text-[7px] ${/\d/.test(password) ? "text-secondary" : "text-muted-foreground"}`}>
                    {/\d/.test(password) ? "✅" : "○"} 1 number
                  </p>
                  <p className={`font-pixel text-[7px] ${/[^a-zA-Z0-9]/.test(password) ? "text-secondary" : "text-muted-foreground"}`}>
                    {/[^a-zA-Z0-9]/.test(password) ? "✅" : "○"} 1 special character
                  </p>
                </div>
              )}
            </div>

            {errors.length > 0 && (
              <div className="space-y-1">
                {errors.map((err, i) => (
                  <p key={i} className="text-destructive font-pixel text-[8px] leading-relaxed">
                    ⚠️ {err}
                  </p>
                ))}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground font-pixel text-[10px] pixel-btn"
            >
              {isLogin ? "▶ LOG IN" : "▶ SIGN UP"}
            </button>
          </form>

          <button
            onClick={() => { setIsLogin(!isLogin); setErrors([]); setFullName(""); }}
            className="w-full mt-4 text-center text-muted-foreground font-pixel text-[8px] hover:text-primary transition-colors"
          >
            {isLogin ? "New user? SIGN UP" : "Returning? LOG IN"}
          </button>
        </div>
      </div>
    </div>
  );
}
