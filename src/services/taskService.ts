const BASE_URL = "http://127.0.0.1:8000";

// Get tasks
export const getTasks = async (userId: number) => {
  const res = await fetch(`${BASE_URL}/tasks?user_id=${userId}`);
  return res.json();
};

// Create task
export const createTask = async (task: any, userId: number) => {
  const res = await fetch(`${BASE_URL}/tasks?user_id=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  return res.json();
};