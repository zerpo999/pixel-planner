import { useState } from "react";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import AddEditTaskDialog from "@/components/AddEditTaskDialog";
import { Task } from "@/types";
import TaskItem from "@/components/TaskItem";

export default function HistoryPage() {
  const { tasks, completeTask, updateTask } = useApp();
  const [showDialog, setShowDialog] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const safeTasks = tasks || [];
  const handleEdit = (task: Task) => {
      setEditingTask(task);
      setShowDialog(true);
    };

  const filteredTasks = safeTasks
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "incomplete") return !task.completed;
      return true;
    })
    .sort((a, b) => {
      const dateA = a.due_date ? Date.parse(a.due_date) : Infinity;
      const dateB = b.due_date ? Date.parse(b.due_date) : Infinity;
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto p-3 sm:p-4 max-w-5xl space-y-4">
        <h1 className="font-pixel flex items-center justify-center text-primary text-[10px] sm:text-xs">
          TASK HISTORY
        </h1>

        {/* Filter + Sort Controls */}
        <div className="flex items-center justify-center  gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`pixel-btn px-2 py-1 font-pixel text-[8px] ${
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            ALL
          </button>

          <button
            onClick={() => setFilter("completed")}
            className={`pixel-btn px-2 py-1 font-pixel text-[8px] ${
              filter === "completed"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            COMPLETED
          </button>

          <button
            onClick={() => setFilter("incomplete")}
            className={`pixel-btn px-2 py-1 font-pixel text-[8px] ${
              filter === "incomplete"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            INCOMPLETE
          </button>

          <button
            onClick={() =>
              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
            }
            className="pixel-btn px-2 py-1 font-pixel text-[8px]"
          >
            SORT: {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {filteredTasks.length === 0 && (
            <p className="font-pixel text-[10px] text-muted-foreground">
              No tasks match this filter.
            </p>
          )}

          {filteredTasks.map((task) => ( <TaskItem key={task.id} task={task} onEdit={handleEdit} /> ))}
            <AddEditTaskDialog
              open={showDialog}
              onClose={() => setShowDialog(false)}
              editTask={editingTask}
            />
            {/* <div
              key={task.id}
              className="pixel-border p-2 flex justify-between items-center bg-card"
            >
              <div className="flex justify-start items-center gap-4">
                <button
                  onClick={() => updateTask(task.id, { completed: !task.completed })}
                  className="text-xs flex-shrink-0"
                >
                  {task.completed ? <CheckboxOn /> : <Checkbox/>}
                </button>
                                                
                <span className="font-pixel text-[10px] text-foreground">
                  {task.title}
                </span>

                <span className="font-pixel text-[8px] text-muted-foreground">
                  Due: {task.due_date || "No due date"}
                </span> */}
              </div>

            </div>
        </div>
  );
}