import { useState, useEffect, createContext, useContext, ReactNode } from "react";

export interface User {
  id: string;
  username: string;
  token: string;
}

export interface Task {
  id: string;
  title: string;
  due_date: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  created_at: string;
  completed_at?: string;
}

export interface Streak {
  current: number;
  last_completed_date: string | null;
}

interface AppContextType {
  user: User | null;
  tasks: Task[];
  streak: Streak;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  logout: () => void;
  addTask: (title: string, due_date: string, priority: Task["priority"]) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}

function getStoredUsers(): Record<string, { password: string; id: string }> {
  return JSON.parse(localStorage.getItem("sp_users") || "{}");
}

function getStoredTasks(userId: string): Task[] {
  return JSON.parse(localStorage.getItem(`sp_tasks_${userId}`) || "[]");
}

function getStoredStreak(userId: string): Streak {
  return JSON.parse(localStorage.getItem(`sp_streak_${userId}`) || '{"current":0,"last_completed_date":null}');
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("sp_current_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState<Streak>({ current: 0, last_completed_date: null });

  useEffect(() => {
    if (user) {
      setTasks(getStoredTasks(user.id));
      setStreak(getStoredStreak(user.id));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`sp_tasks_${user.id}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`sp_streak_${user.id}`, JSON.stringify(streak));
    }
  }, [streak, user]);

  const register = (username: string, password: string): boolean => {
    const users = getStoredUsers();
    if (users[username]) return false;
    const id = crypto.randomUUID();
    users[username] = { password, id };
    localStorage.setItem("sp_users", JSON.stringify(users));
    const u = { id, username, token: `token_${id}` };
    setUser(u);
    localStorage.setItem("sp_current_user", JSON.stringify(u));
    return true;
  };

  const login = (username: string, password: string): boolean => {
    const users = getStoredUsers();
    const entry = users[username];
    if (!entry || entry.password !== password) return false;
    const u = { id: entry.id, username, token: `token_${entry.id}` };
    setUser(u);
    localStorage.setItem("sp_current_user", JSON.stringify(u));
    return true;
  };

  const logout = () => {
    setUser(null);
    setTasks([]);
    setStreak({ current: 0, last_completed_date: null });
    localStorage.removeItem("sp_current_user");
  };

  const addTask = (title: string, due_date: string, priority: Task["priority"]) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      due_date,
      priority,
      completed: false,
      created_at: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, task]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const completeTask = (id: string) => {
    const today = new Date().toISOString().split("T")[0];
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: true, completed_at: new Date().toISOString() } : t
      )
    );
    setStreak((prev) => {
      if (prev.last_completed_date === today) return prev;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      const newCurrent = prev.last_completed_date === yesterdayStr ? prev.current + 1 : 1;
      return { current: newCurrent, last_completed_date: today };
    });
  };

  return (
    <AppContext.Provider
      value={{ user, tasks, streak, login, register, logout, addTask, updateTask, deleteTask, completeTask }}
    >
      {children}
    </AppContext.Provider>
  );
}
