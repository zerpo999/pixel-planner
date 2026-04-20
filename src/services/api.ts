import { Task, User, Streak } from "@/types";

const API_BASE = "https://pixel-planner-backend-213965080353.us-central1.run.app";

// ------------------------------
// Token & auth helpers
// ------------------------------
function getToken(): string | null {
  return localStorage.getItem("access_token");
}

function setToken(token: string): void {
  localStorage.setItem("access_token", token);
}

function removeToken(): void {
  localStorage.removeItem("access_token");
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

// ------------------------------
// Data mapping
// ------------------------------
function mapBackendTask(task: any): Task {
  return {
    id: String(task.id),
    title: task.title,
    description: task.description ?? "",
    category: task.category ?? "",
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

// ------------------------------
// Registration deduplication
// ------------------------------
let activeRegistrationPromise: Promise<User> | null = null;

// ------------------------------
// AUTH ENDPOINTS
// ------------------------------
export async function apiRegister(
  username: string,
  password: string,
  fullName: string
): Promise<User> {
  // Prevent concurrent registration calls
  if (activeRegistrationPromise) {
    console.warn("⚠️ Registration already in progress, returning existing promise");
    return activeRegistrationPromise;
  }

  activeRegistrationPromise = (async () => {
    console.log("🔵 apiRegister called with:", { username, fullName });

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
      const errorText = await registerRes.text();
      console.error("🔴 Registration failed:", errorText);
      await parseError(registerRes, "Registration failed");
    }

    const createdUser = await registerRes.json();
    console.log("🟢 Registration succeeded:", createdUser);

    // Auto-login after registration
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password }),
    });

    if (!loginRes.ok) {
      console.error("🔴 Auto-login failed after registration");
      await parseError(loginRes, "Auto-login failed");
    }

    const tokenData = await loginRes.json();
    setToken(tokenData.access_token);

    const user = mapUserForFrontend(createdUser, tokenData.access_token);
    console.log("✅ Returning user from apiRegister:", user);
    return user;
  })();

  try {
    return await activeRegistrationPromise;
  } finally {
    activeRegistrationPromise = null;
  }
}

export async function apiLogin(username: string, password: string): Promise<User> {
  console.log("🔵 apiLogin called with:", { username });
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username, password }),
  });

  if (!loginRes.ok) {
    removeToken();
    await parseError(loginRes, "Invalid credentials");
  }

  const tokenData = await loginRes.json();
  setToken(tokenData.access_token);

  // Fetch current user to get proper id and full_name
  const meRes = await fetch(`${API_BASE}/auth/me`, {
    headers: authHeaders(false),
  });
  let user: User;
  if (meRes.ok) {
    const me = await meRes.json();
    user = {
      id: String(me.id),
      username: me.username,
      fullName: me.full_name ?? username,
      token: tokenData.access_token,
    };
  } else {
    // Fallback if /auth/me doesn't exist
    user = {
      id: username,
      username,
      fullName: username,
      token: tokenData.access_token,
    };
  }
  console.log("✅ Login successful, user:", user);
  return user;
}

export function apiLogout(): void {
  removeToken();
}

// ------------------------------
// CURRENT USER
// ------------------------------
export async function apiGetCurrentUser(): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: authHeaders(false),
  });

  if (!res.ok) {
    await parseError(res, "Failed to get current user");
  }

  const data = await res.json();
  return {
    id: String(data.id),
    username: data.username,
    fullName: data.full_name ?? data.username,
    token: getToken()!,
  };
}

// ------------------------------
// TASK ENDPOINTS
// ------------------------------
export async function apiGetTasks(): Promise<Task[]> {
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

// Updated: only send fields that are actually present in the updates object
export async function apiUpdateTask(
  taskId: string,
  updates: Partial<Task>
): Promise<Task> {
  const body: any = {};

  if (updates.title !== undefined) body.title = updates.title;
  if (updates.description !== undefined) body.description = updates.description ?? null;
  if (updates.category !== undefined) body.category = updates.category ?? null;
  if (updates.color !== undefined) body.color_code = updates.color ?? null;
  if (updates.priority !== undefined) body.priority = updates.priority ?? "medium";
  if (updates.completed !== undefined) body.completed = updates.completed;
  if (updates.due_date !== undefined) {
    body.due_date = updates.due_date ? `${updates.due_date}T00:00:00` : null;
  }

  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: "PUT",
    headers: authHeaders(true),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    await parseError(res, "Failed to update task");
  }

  const data = await res.json();
  return mapBackendTask(data);
}

export async function apiDeleteTask(taskId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: "DELETE",
    headers: authHeaders(false),
  });

  if (!res.ok) {
    await parseError(res, "Failed to delete task");
  }
}

// Fixed: now sends only { completed: true }
export async function apiCompleteTask(taskId: string): Promise<{ task: Task; streak: Streak }> {
  const updatedTask = await apiUpdateTask(taskId, { completed: true });
  const streak = await apiGetStreak();
  return { task: updatedTask, streak };
}

// ------------------------------
// STREAK ENDPOINTS
// ------------------------------
export async function apiGetStreak(): Promise<Streak> {
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