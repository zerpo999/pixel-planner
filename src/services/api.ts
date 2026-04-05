import { Task, User, Streak } from "@/types";

const API_BASE = "/api";

function getToken(): string | null {
  const user = localStorage.getItem("sq_current_user");
  if (!user) return null;
  return JSON.parse(user).token;
}

function headers(): HeadersInit {
  const token = getToken();
  const h: HeadersInit = { "Content-Type": "application/json" };
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

// Since no real backend exists, we use localStorage as mock storage.
// The API functions simulate what real API calls would look like.

function getStoredUsers(): Record<string, { password: string; id: string; fullName: string }> {
  return JSON.parse(localStorage.getItem("sq_users") || "{}");
}

function getStoredTasks(userId: string): Task[] {
  return JSON.parse(localStorage.getItem(`sq_tasks_${userId}`) || "[]");
}

function saveStoredTasks(userId: string, tasks: Task[]) {
  localStorage.setItem(`sq_tasks_${userId}`, JSON.stringify(tasks));
}

function getStoredStreak(userId: string): Streak {
  return JSON.parse(
    localStorage.getItem(`sq_streak_${userId}`) || '{"current":0,"longest":0,"last_completed_date":null}'
  );
}

function saveStoredStreak(userId: string, streak: Streak) {
  localStorage.setItem(`sq_streak_${userId}`, JSON.stringify(streak));
}

// Auth
export async function apiRegister(username: string, password: string, fullName: string): Promise<User> {
  const users = getStoredUsers();
  if (users[username]) throw new Error("Username already taken");
  const id = crypto.randomUUID();
  users[username] = { password, id, fullName };
  localStorage.setItem("sq_users", JSON.stringify(users));
  const user: User = { id, username, fullName, token: `token_${id}` };
  localStorage.setItem("sq_current_user", JSON.stringify(user));
  return user;
}

export async function apiLogin(username: string, password: string): Promise<User> {
  const users = getStoredUsers();
  const entry = users[username];
  if (!entry || entry.password !== password) throw new Error("Invalid credentials");
  const user: User = { id: entry.id, username, fullName: entry.fullName || username, token: `token_${entry.id}` };
  localStorage.setItem("sq_current_user", JSON.stringify(user));
  return user;
}

export function apiLogout() {
  localStorage.removeItem("sq_current_user");
}

// Tasks
export async function apiGetTasks(userId: string): Promise<Task[]> {
  return getStoredTasks(userId);
}

export async function apiCreateTask(userId: string, task: Omit<Task, "id" | "completed" | "created_at">): Promise<Task> {
  const tasks = getStoredTasks(userId);
  const newTask: Task = {
    ...task,
    id: crypto.randomUUID(),
    completed: false,
    created_at: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveStoredTasks(userId, tasks);
  return newTask;
}

export async function apiUpdateTask(userId: string, id: string, updates: Partial<Task>): Promise<Task> {
  const tasks = getStoredTasks(userId);
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Task not found");
  tasks[idx] = { ...tasks[idx], ...updates };
  saveStoredTasks(userId, tasks);
  return tasks[idx];
}

export async function apiDeleteTask(userId: string, id: string): Promise<void> {
  const tasks = getStoredTasks(userId).filter((t) => t.id !== id);
  saveStoredTasks(userId, tasks);
}

export async function apiCompleteTask(userId: string, id: string): Promise<{ task: Task; streak: Streak }> {
  const tasks = getStoredTasks(userId);
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Task not found");
  tasks[idx] = { ...tasks[idx], completed: true, completed_at: new Date().toISOString() };
  saveStoredTasks(userId, tasks);

  const today = new Date().toISOString().split("T")[0];
  const streak = getStoredStreak(userId);
  if (streak.last_completed_date !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    streak.current = streak.last_completed_date === yesterdayStr ? streak.current + 1 : 1;
    streak.last_completed_date = today;
    if (streak.current > streak.longest) streak.longest = streak.current;
    saveStoredStreak(userId, streak);
  }

  return { task: tasks[idx], streak };
}

export async function apiGetStreak(userId: string): Promise<Streak> {
  return getStoredStreak(userId);
}
