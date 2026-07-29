import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Roadmap {
  id: string;
  name: string;
  project: string;
  status: "planning" | "active" | "completed";
  progress: number;
  startDate: string;
  endDate: string;
  owner: string;
  items: number;
}

const INITIAL_ROADMAPS: Roadmap[] = [
  {
    id: "roadmap-1",
    name: "Q1 2026 - Core Features",
    project: "FlowPilot Frontend",
    status: "active",
    progress: 65,
    startDate: "2026-01-01",
    endDate: "2026-03-31",
    owner: "John Doe",
    items: 12,
  },
  {
    id: "roadmap-2",
    name: "Q2 2026 - Advanced Features",
    project: "FlowPilot Frontend",
    status: "planning",
    progress: 0,
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    owner: "John Doe",
    items: 8,
  },
  {
    id: "roadmap-3",
    name: "Mobile App Launch",
    project: "Mobile App",
    status: "planning",
    progress: 20,
    startDate: "2026-02-01",
    endDate: "2026-08-31",
    owner: "Jane Smith",
    items: 15,
  },
  {
    id: "roadmap-4",
    name: "Backend Infrastructure",
    project: "FlowPilot Backend",
    status: "active",
    progress: 45,
    startDate: "2026-01-15",
    endDate: "2026-05-15",
    owner: "Bob Johnson",
    items: 10,
  },
];

interface RoadmapStore {
  roadmaps: Roadmap[];
  addRoadmap: (roadmap: Omit<Roadmap, "id">) => Roadmap;
  updateRoadmap: (id: string, updates: Partial<Roadmap>) => void;
  deleteRoadmap: (id: string) => void;
  getRoadmap: (id: string) => Roadmap | undefined;
}

export const useRoadmapsStore = create<RoadmapStore>(
  persist(
    (set, get) => ({
      roadmaps: INITIAL_ROADMAPS,

      addRoadmap: (roadmapData) => {
        const newRoadmap: Roadmap = {
          ...roadmapData,
          id: `roadmap-${Date.now()}`,
        };
        set((state) => ({
          roadmaps: [...state.roadmaps, newRoadmap],
        }));
        return newRoadmap;
      },

      updateRoadmap: (id, updates) => {
        set((state) => ({
          roadmaps: state.roadmaps.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        }));
      },

      deleteRoadmap: (id) => {
        set((state) => ({
          roadmaps: state.roadmaps.filter((r) => r.id !== id),
        }));
      },

      getRoadmap: (id) => {
        return get().roadmaps.find((r) => r.id === id);
      },
    }),
    {
      name: "roadmaps-store",
      getStorage: () => localStorage,
      onRehydrate: (state) => {
        if (!state.roadmaps.some((r) => r.id === "roadmap-1")) {
          state.roadmaps = [...INITIAL_ROADMAPS, ...state.roadmaps.filter((r) => !r.id.startsWith("roadmap-"))];
        }
      },
    }
  )
);
