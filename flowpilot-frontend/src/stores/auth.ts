import { create } from "zustand";
import { User } from "@/types";
import { MOCK_USER } from "@/constants";

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: MOCK_USER,
  isLoading: false,
  setUser: (user: User | null) => set({ user }),
  logout: () => {
    set({ user: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem("flowpilot_auth");
      localStorage.removeItem("flowpilot_token");
    }
  },
  initializeAuth: () => {
    if (typeof window !== "undefined") {
      const authToken = localStorage.getItem("flowpilot_token");
      const authUser = localStorage.getItem("flowpilot_auth");

      if (authToken && authUser) {
        try {
          const user = JSON.parse(authUser);
          set({ user, isLoading: false });
          return;
        } catch {
          set({ user: null, isLoading: false });
          return;
        }
      }
    }
    set({ isLoading: false });
  },
}))
