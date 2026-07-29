import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  joinedDate?: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  members: TeamMember[];
  totalTasks: number;
  avgWorkload: number;
  createdDate?: string;
}

const INITIAL_TEAMS: Team[] = [
  {
    id: "team-1",
    name: "Frontend Team",
    description: "Next.js and React specialists",
    members: [
      { id: "user-1", name: "John Doe", email: "john@example.com", role: "owner", joinedDate: "2026-01-01" },
      { id: "user-2", name: "Jane Smith", email: "jane@example.com", role: "admin", joinedDate: "2026-01-15" },
    ],
    totalTasks: 24,
    avgWorkload: 72,
    createdDate: "2026-01-01",
  },
  {
    id: "team-2",
    name: "Backend Team",
    description: "NestJS and API development",
    members: [
      { id: "user-3", name: "Bob Johnson", email: "bob@example.com", role: "owner", joinedDate: "2026-01-01" },
    ],
    totalTasks: 18,
    avgWorkload: 85,
    createdDate: "2026-01-01",
  },
];

interface TeamsStore {
  teams: Team[];
  addTeam: (team: Omit<Team, "id">) => Team;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  getTeam: (id: string) => Team | undefined;
}

export const useTeamsStore = create<TeamsStore>(
  persist(
    (set, get) => ({
      teams: INITIAL_TEAMS,

      addTeam: (teamData) => {
        const newTeam: Team = {
          ...teamData,
          id: `team-${Date.now()}`,
        };
        set((state) => ({
          teams: [...state.teams, newTeam],
        }));
        return newTeam;
      },

      updateTeam: (id, updates) => {
        set((state) => ({
          teams: state.teams.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },

      deleteTeam: (id) => {
        set((state) => ({
          teams: state.teams.filter((t) => t.id !== id),
        }));
      },

      getTeam: (id) => {
        return get().teams.find((t) => t.id === id);
      },
    }),
    {
      name: "teams-store",
      getStorage: () => localStorage,
      onRehydrate: (state) => {
        if (!state.teams.some((t) => t.id === "team-1")) {
          state.teams = [...INITIAL_TEAMS, ...state.teams.filter((t) => !t.id.startsWith("team-"))];
        }
      },
    }
  )
);
