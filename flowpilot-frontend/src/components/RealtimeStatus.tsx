"use client";

import { useRealtimeStore } from "@/stores/realtimeActivity";
import { Wifi, WifiOff, Zap } from "lucide-react";

interface RealtimeStatusProps {
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function RealtimeStatus({ showLabel = true, size = "md" } : RealtimeStatusProps) {
  const { isConnected, isLive, lastUpdate } = useRealtimeStore();

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  return (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <>
          <div className="relative">
            <div className={`${sizeClasses[size]} rounded-full bg-green-600`} />
            {isLive && (
              <div
                className={`absolute inset-0 rounded-full bg-green-400 animate-pulse`}
              />
            )}
          </div>
          {showLabel && (
            <span className="text-xs font-medium text-green-600">
              {isLive ? "Live" : "Connected"}
            </span>
          )}
        </>
      ) : (
        <>
          <div className={`${sizeClasses[size]} rounded-full bg-gray-400`} />
          {showLabel && (
            <span className="text-xs font-medium text-gray-600">Offline</span>
          )}
        </>
      )}
    </div>
  );
}

export function RealtimeIndicator() {
  const { isConnected, isLive } = useRealtimeStore();

  return (
    <div className="flex items-center justify-center">
      {isConnected ? (
        <div className="relative">
          {isLive && (
            <>
              <Zap
                size={20}
                className="text-green-600 animate-pulse"
              />
              <div className="absolute inset-0 animate-ping">
                <Zap size={20} className="text-green-400 opacity-50" />
              </div>
            </>
          )}
          {!isLive && <Wifi size={20} className="text-green-600" />}
        </div>
      ) : (
        <WifiOff size={20} className="text-gray-400" />
      )}
    </div>
  );
}

export function RealtimeWidget() {
  const { isConnected, updateCount } = useRealtimeStore();

  return (
    <div
      className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
        isConnected
          ? "bg-green-600/10 text-green-600 border border-green-600/20"
          : "bg-gray-600/10 text-gray-600 border border-gray-600/20"
      }`}
    >
      <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-600" : "bg-gray-600"}`} />
      <span>{isConnected ? "Connected" : "Offline"}</span>
      {updateCount > 0 && (
        <span className="ml-auto text-xs opacity-70">+{updateCount} updates</span>
      )}
    </div>
  );
}
