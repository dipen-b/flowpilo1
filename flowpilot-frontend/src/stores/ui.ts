import { create } from "zustand";

interface UIStore {
  sidebarOpen: boolean;
  sidebarWidth: number;
  contextPanelOpen: boolean;
  contextPanelWidth: number;
  theme: "light" | "dark";
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  toggleContextPanel: () => void;
  setContextPanelWidth: (width: number) => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  sidebarWidth: 280,
  contextPanelOpen: true,
  contextPanelWidth: 360,
  theme: "dark",
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
  toggleContextPanel: () => set((state) => ({ contextPanelOpen: !state.contextPanelOpen })),
  setContextPanelWidth: (width) => set({ contextPanelWidth: width }),
  setTheme: (theme) => set({ theme }),
}));
