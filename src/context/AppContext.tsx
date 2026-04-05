import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";
import { User, Task, Streak } from "@/types";
import {
  apiRegister, apiLogin, apiLogout, apiGetTasks, apiCreateTask,
  apiUpdateTask, apiDeleteTask, apiCompleteTask, apiGetStreak,
} from "@/services/api";

interface AppContextType {
  user: User | null;
  tasks: Task[];
  streak: Streak;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, fullName: string) => Promise<boolean>;
  logout: () => void;
  addTask: (task: Omit<Task, "id" | "completed" | "created_at">) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("sq_current_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState<Streak>({ current: 0, longest: 0, last_completed_date: null });
  const [loading, setLoading] = useState(false);

  const refreshTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [t, s] = await Promise.all([apiGetTasks(user.id), apiGetStreak(user.id)]);
      setTasks(t);
      setStreak(s);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) refreshTasks();
  }, [user, refreshTasks]);

  const register = async (username: string, password: string, fullName: string): Promise<boolean> => {
    try {
      const u = await apiRegister(username, password, fullName);
      setUser(u);
      return true;
    } catch {
      return false;
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const u = await apiLogin(username, password);
      setUser(u);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    setTasks([]);
    setStreak({ current: 0, longest: 0, last_completed_date: null });
  };

  const addTask = async (task: Omit<Task, "id" | "completed" | "created_at">) => {
    if (!user) return;
    await apiCreateTask(user.id, task);
    await refreshTasks();
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) return;
    await apiUpdateTask(user.id, id, updates);
    await refreshTasks();
  };

  const deleteTask = async (id: string) => {
    if (!user) return;
    await apiDeleteTask(user.id, id);
    await refreshTasks();
  };

  const completeTask = async (id: string) => {
    if (!user) return;
    const result = await apiCompleteTask(user.id, id);
    setStreak(result.streak);
    await refreshTasks();
  };

  return (
    <AppContext.Provider
      value={{ user, tasks, streak, loading, login, register, logout, addTask, updateTask, deleteTask, completeTask, refreshTasks }}
    >
      {children}
    </AppContext.Provider>
  );
}
