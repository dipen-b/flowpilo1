import { create } from "zustand";
import { useActivityStore } from "./activity";
import { isSocketConnected, onActivityEvent, offActivityEvent } from "@/services/socket";

interface RealtimeStatus {
  isConnected: boolean;
  lastUpdate: number | null;
  updateCount: number;
  isLive: boolean;
}

interface RealtimeActivityStore extends RealtimeStatus {
  initializeRealtime: () => void;
  cleanup: () => void;
  updateRealtimeStatus: (status: Partial<RealtimeStatus>) => void;
}

export const useRealtimeStore = create<RealtimeActivityStore>((set) => ({
  isConnected: false,
  lastUpdate: null,
  updateCount: 0,
  isLive: false,

  initializeRealtime: () => {
    // Listen for new activities from server
    const handleNewActivity = (activity: any) => {
      console.log("Received real-time activity:", activity);

      // Add to activity store
      useActivityStore.getState().addActivity({
        type: activity.type,
        action: activity.action,
        actor: activity.actor,
        target: activity.target,
        description: activity.description,
        metadata: activity.metadata,
      });

      // Update realtime status
      set((state) => ({
        lastUpdate: Date.now(),
        updateCount: state.updateCount + 1,
        isLive: true,
      }));

      // Reset live indicator after 3 seconds
      setTimeout(() => {
        set({ isLive: false });
      }, 3000);
    };

    // Listen for connection status
    const handleConnect = () => {
      console.log("Realtime connection established");
      set({ isConnected: true });
    };

    const handleDisconnect = () => {
      console.log("Realtime connection lost");
      set({ isConnected: false });
    };

    // Register listeners
    onActivityEvent("activity:new", handleNewActivity);
    onActivityEvent("connect", handleConnect);
    onActivityEvent("disconnect", handleDisconnect);

    // Set initial connection status
    set({ isConnected: isSocketConnected() });

    // Return cleanup function
    return () => {
      offActivityEvent("activity:new", handleNewActivity);
      offActivityEvent("connect", handleConnect);
      offActivityEvent("disconnect", handleDisconnect);
    };
  },

  cleanup: () => {
    offActivityEvent("activity:new");
    offActivityEvent("connect");
    offActivityEvent("disconnect");
  },

  updateRealtimeStatus: (status) => {
    set(status);
  },
}));
