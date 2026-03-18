import { io, Socket } from "socket.io-client";
let socket: Socket | null = null;
export const getSocket = (): Socket => {
  if (!socket) {
    socket = io('https://wd05.pupasoft.com', {
      path: '/socket.io/',
      transports: ["websocket"],
      autoConnect: true,
    });
  }
  return socket;
};
