import { Task, User, Streak } from "@/types";

const API_BASE = "http://127.0.0.1:8000";

function getStoredUser(): User | null {
  const raw = localStorage.getItem("sq_current_user");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem("sq_current_user");
    return null;
  }
}

function getToken(): string | null {
  return getStoredUser()?.token ?? null;
}

function authHeaders(includeJson = true): HeadersInit {
  const token = getToken();
  const headers: HeadersInit = {};

  if (includeJson) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return headers;
}

async function parseError(res: Response, fallback: string): Promise<never> {
  try {
    const data = await res.json();
    throw new Error(data.detail || fallback);
  } catch {
    throw new Error(fallback);
  }
}

function mapBackendTask(task: any): Task {
  return {
    id: String(task.id),
    title: task.title,
    description: task.description ?? "",
    category: task.category ?? "Study",
    color: task.color_code ?? "#ff6b6b",
    due_date: task.due_date ? String(task.due_date).split("T")[0] : "",
    priority: task.priority ?? "medium",
    completed: task.completed ?? false,
    created_at: task.created_at ?? new Date().toISOString(),
    completed_at: task.completed_at ?? undefined,
  };
}

function mapUserForFrontend(user: any, token: string): User {
  return {
    id: String(user.id),
    username: user.username,
    fullName: user.full_name ?? user.username,
    token,
  };
}

// AUTH

export async function apiRegister(
  username: string,
  password: string,
  fullName: string
): Promise<User> {
  const registerRes = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      full_name: fullName,
      email: null,
    }),
  });

  if (!registerRes.ok) {
    await parseError(registerRes, "Registration failed");
  }

  const createdUser = await registerRes.json();

  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      username,
      password,
    }),
  });

  if (!loginRes.ok) {
    await parseError(loginRes, "Auto-login failed");
  }

  const tokenData = await loginRes.json();
  const user = mapUserForFrontend(createdUser, tokenData.access_token);

  localStorage.setItem("sq_current_user", JSON.stringify(user));
  return user;
}

export async function apiLogin(
  username: string,
  password: string
): Promise<User> {
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      username,
      password,
    }),
  });

  if (!loginRes.ok) {
    localStorage.removeItem("sq_current_user");
    await parseError(loginRes, "Invalid credentials");
  }

  const tokenData = await loginRes.json();

  const user: User = {
    id: username,
    username,
    fullName: username,
    token: tokenData.access_token,
  };

  localStorage.setItem("sq_current_user", JSON.stringify(user));
  return user;
}

export function apiLogout() {
  localStorage.removeItem("sq_current_user");
}

// TASKS

export async function apiGetTasks(_userId: string): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/tasks/`, {
    method: "GET",
    headers: authHeaders(false),
  });

  if (!res.ok) {
    await parseError(res, "Failed to load tasks");
  }

  const data = await res.json();
  return data.map(mapBackendTask);
}

export async function apiCreateTask(
  _userId: string,
  task: Omit<Task, "id" | "completed" | "created_at">
): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/`, {
    method: "POST",
    headers: authHeaders(true),
    body: JSON.stringify({
      title: task.title,
      description: task.description ?? null,
      category: task.category ?? null,
      color_code: task.color ?? null,
      due_date: task.due_date ? `${task.due_date}T00:00:00` : null,
      priority: task.priority ?? "medium",
    }),
  });

  if (!res.ok) {
    await parseError(res, "Failed to create task");
  }

  const data = await res.json();
  return mapBackendTask(data);
}

export async function apiUpdateTask(
  _userId: string,
  id: string,
  updates: Partial<Task>
): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PUT",
    headers: authHeaders(true),
    body: JSON.stringify({
      title: updates.title,
      description: updates.description ?? null,
      category: updates.category ?? null,
      color_code: updates.color ?? null,
      due_date: updates.due_date
        ? `${updates.due_date}T00:00:00`
        : updates.due_date ?? null,
      priority: updates.priority ?? "medium",
      completed: updates.completed,
    }),
  });

  if (!res.ok) {
    await parseError(res, "Failed to update task");
  }

  const data = await res.json();
  return mapBackendTask(data);
}

export async function apiDeleteTask(
  _userId: string,
  id: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "DELETE",
    headers: authHeaders(false),
  });

  if (!res.ok) {
    await parseError(res, "Failed to delete task");
  }
}

export async function apiCompleteTask(
  userId: string,
  id: string
): Promise<{ task: Task; streak: Streak }> {
  const task = await apiUpdateTask(userId, id, { completed: true });
  const streak = await apiGetStreak(userId);
  return { task, streak };
}

// STREAK

export async function apiGetStreak(_userId: string): Promise<Streak> {
  const res = await fetch(`${API_BASE}/tasks/streak`, {
    method: "GET",
    headers: authHeaders(false),
  });

  if (!res.ok) {
    await parseError(res, "Failed to load streak");
  }

  const data = await res.json();

  return {
    current: data.current_streak ?? 0,
    longest: data.longest_streak ?? 0,
    last_completed_date: data.last_completed_date
      ? String(data.last_completed_date).split("T")[0]
      : null,
  };
}