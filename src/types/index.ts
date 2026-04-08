export interface User {
  id: string;
  username: string;
  fullName: string;
  token: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  color: string;
  due_date: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  created_at: string;
  completed_at?: string;
}

export interface Streak {
  current: number;
  longest: number;
  last_completed_date: string | null;
}
