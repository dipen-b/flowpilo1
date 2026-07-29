import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "planning" | "active" | "on_hold" | "at_risk" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "critical";
  startDate: string;
  dueDate: string;
  progress: number;
  owner: { id: string; name: string };
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "FlowPilot Frontend",
    description: "Next.js frontend application",
    status: "active",
    priority: "high",
    progress: 65,
    startDate: "2026-01-15",
    dueDate: "2026-06-30",
    owner: { id: "user-1", name: "John Doe" },
  },
  {
    id: "proj-2",
    name: "FlowPilot Backend",
    description: "NestJS backend API",
    status: "active",
    priority: "high",
    progress: 45,
    startDate: "2026-01-15",
    dueDate: "2026-06-30",
    owner: { id: "user-1", name: "John Doe" },
  },
  {
    id: "proj-3",
    name: "Mobile App",
    description: "React Native mobile app",
    status: "planning",
    priority: "medium",
    progress: 10,
    startDate: "2026-04-01",
    dueDate: "2026-09-30",
    owner: { id: "user-1", name: "John Doe" },
  },
];

interface ProjectStore {
  projects: Project[];
  addProject: (project: Omit<Project, "id" | "progress">) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
}

export const useProjectsStore = create<ProjectStore>(
  persist(
    (set, get) => ({
      projects: INITIAL_PROJECTS,

      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: `proj-${Date.now()}`,
          progress: 0,
        };
        set((state) => ({
          projects: [...state.projects, newProject],
        }));
        return newProject;
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }));
      },

      getProject: (id) => {
        return get().projects.find((p) => p.id === id);
      },
    }),
    {
      name: "projects-store",
      getStorage: () => localStorage,
      onRehydrate: (state) => {
        // Ensure initial projects are always present
        if (!state.projects.some((p) => p.id === "proj-1")) {
          state.projects = [...INITIAL_PROJECTS, ...state.projects.filter((p) => !p.id.startsWith("proj-"))];
        }
      },
    }
  )
);
