import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initializeSocket = (url: string = "http://localhost:3001") => {
  if (socket) {
    return socket;
  }

  socket = io(url, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const emitActivity = (eventName: string, data: any) => {
  if (socket && socket.connected) {
    socket.emit(eventName, data);
  }
};

export const onActivityEvent = (eventName: string, callback: (data: any) => void) => {
  if (socket) {
    socket.on(eventName, callback);
  }
};

export const offActivityEvent = (eventName: string, callback?: (data: any) => void) => {
  if (socket) {
    if (callback) {
      socket.off(eventName, callback);
    } else {
      socket.off(eventName);
    }
  }
};

export const isSocketConnected = (): boolean => {
  return socket ? socket.connected : false;
};
