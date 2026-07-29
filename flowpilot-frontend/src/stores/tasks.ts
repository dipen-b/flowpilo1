import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Task {
  id: string;
  title: string;
  project: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "critical" | "high" | "medium" | "low";
  dueDate: string;
  assignee: string;
}

const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Build dashboard widgets",
    project: "FlowPilot Frontend",
    status: "in_progress",
    priority: "high",
    dueDate: "2026-03-01",
    assignee: "John Doe",
  },
  {
    id: "task-2",
    title: "Setup authentication",
    project: "FlowPilot Frontend",
    status: "done",
    priority: "high",
    dueDate: "2026-02-15",
    assignee: "John Doe",
  },
  {
    id: "task-3",
    title: "Create API endpoints",
    project: "FlowPilot Backend",
    status: "todo",
    priority: "high",
    dueDate: "2026-03-15",
    assignee: "John Doe",
  },
  {
    id: "task-4",
    title: "Database optimization",
    project: "FlowPilot Backend",
    status: "todo",
    priority: "medium",
    dueDate: "2026-04-01",
    assignee: "John Doe",
  },
  {
    id: "task-5",
    title: "Mobile app UI design",
    project: "Mobile App",
    status: "todo",
    priority: "medium",
    dueDate: "2026-03-20",
    assignee: "John Doe",
  },
];

interface TasksStore {
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTask: (id: string) => Task | undefined;
}

export const useTasksStore = create<TasksStore>(
  persist(
    (set, get) => ({
      tasks: INITIAL_TASKS,

      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: `task-${Date.now()}`,
        };
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
        return newTask;
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      getTask: (id) => {
        return get().tasks.find((t) => t.id === id);
      },
    }),
    {
      name: "tasks-store",
      getStorage: () => localStorage,
      onRehydrate: (state) => {
        if (!state.tasks.some((t) => t.id === "task-1")) {
          state.tasks = [...INITIAL_TASKS, ...state.tasks.filter((t) => !t.id.startsWith("task-"))];
        }
      },
    }
  )
);
