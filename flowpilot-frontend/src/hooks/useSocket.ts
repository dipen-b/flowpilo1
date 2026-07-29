"use client";

import { useEffect, useState } from "react";
import {
  initializeSocket,
  disconnectSocket,
  isSocketConnected,
  onActivityEvent,
  offActivityEvent,
  emitActivity,
} from "@/services/socket";
import { Socket } from "socket.io-client";

export const useSocket = (url?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = initializeSocket(url);
    setSocket(socketInstance);

    const handleConnect = () => {
      setIsConnected(true);
      console.log("Connected to socket");
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log("Disconnected from socket");
    };

    socketInstance.on("connect", handleConnect);
    socketInstance.on("disconnect", handleDisconnect);

    // Set initial connection state
    setIsConnected(socketInstance.connected);

    return () => {
      socketInstance.off("connect", handleConnect);
      socketInstance.off("disconnect", handleDisconnect);
      // Don't disconnect on unmount - keep connection alive
    };
  }, [url]);

  const emit = (eventName: string, data: any) => {
    emitActivity(eventName, data);
  };

  const on = (eventName: string, callback: (data: any) => void) => {
    onActivityEvent(eventName, callback);
  };

  const off = (eventName: string, callback?: (data: any) => void) => {
    offActivityEvent(eventName, callback);
  };

  return {
    socket,
    isConnected,
    emit,
    on,
    off,
  };
};
