// src/shared/services/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    socket = io(BASE_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });
  }
  return socket;
};
