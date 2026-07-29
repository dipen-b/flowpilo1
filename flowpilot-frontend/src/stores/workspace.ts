import { create } from "zustand";
import { Workspace } from "@/types";

interface WorkspaceStore {
  workspace: Workspace | null;
  workspaces: Workspace[];
  setWorkspace: (workspace: Workspace) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  addWorkspace: (workspace: Workspace) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspace: {
    id: "workspace-1",
    name: "My Workspace",
    slug: "my-workspace",
    members: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  workspaces: [
    {
      id: "workspace-1",
      name: "My Workspace",
      slug: "my-workspace",
      members: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  setWorkspace: (workspace) => set({ workspace }),
  setWorkspaces: (workspaces) => set({ workspaces }),
  addWorkspace: (workspace) =>
    set((state) => ({
      workspaces: [...state.workspaces, workspace],
    })),
}));
