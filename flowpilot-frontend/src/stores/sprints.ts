import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Sprint {
  id: string;
  name: string;
  project: string;
  status: "planning" | "active" | "completed";
  startDate: string;
  endDate: string;
  goal: string;
  tasks: number;
  completed: number;
  velocity?: number;
}

const INITIAL_SPRINTS: Sprint[] = [
  {
    id: "sprint-1",
    name: "Sprint 1: Setup",
    project: "FlowPilot Frontend",
    status: "completed",
    startDate: "2026-02-01",
    endDate: "2026-02-14",
    goal: "Setup authentication and core infrastructure",
    tasks: 5,
    completed: 5,
    velocity: 34,
  },
  {
    id: "sprint-2",
    name: "Sprint 2: Dashboard & UI",
    project: "FlowPilot Frontend",
    status: "active",
    startDate: "2026-02-15",
    endDate: "2026-03-01",
    goal: "Build dashboard and core UI components",
    tasks: 8,
    completed: 2,
    velocity: 55,
  },
];

interface SprintStore {
  sprints: Sprint[];
  addSprint: (sprint: Omit<Sprint, "id">) => Sprint;
  updateSprint: (id: string, updates: Partial<Sprint>) => void;
  deleteSprint: (id: string) => void;
  getSprint: (id: string) => Sprint | undefined;
}

export const useSprintsStore = create<SprintStore>(
  persist(
    (set, get) => ({
      sprints: INITIAL_SPRINTS,

      addSprint: (sprintData) => {
        const newSprint: Sprint = {
          ...sprintData,
          id: `sprint-${Date.now()}`,
        };
        set((state) => ({
          sprints: [...state.sprints, newSprint],
        }));
        return newSprint;
      },

      updateSprint: (id, updates) => {
        set((state) => ({
          sprints: state.sprints.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }));
      },

      deleteSprint: (id) => {
        set((state) => ({
          sprints: state.sprints.filter((s) => s.id !== id),
        }));
      },

      getSprint: (id) => {
        return get().sprints.find((s) => s.id === id);
      },
    }),
    {
      name: "sprints-store",
      getStorage: () => localStorage,
      onRehydrate: (state) => {
        if (!state.sprints.some((s) => s.id === "sprint-1")) {
          state.sprints = [...INITIAL_SPRINTS, ...state.sprints.filter((s) => !s.id.startsWith("sprint-"))];
        }
      },
    }
  )
);
