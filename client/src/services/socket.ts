import { io, Socket } from 'socket.io-client';
const SOCKET_URL = 'http://localhost:8000';

export const notificationSocket: Socket = io(`${SOCKET_URL}/notification`, {
  withCredentials: true,
  transports: ['websocket'],
});

export const chatSocket: Socket = io(`${SOCKET_URL}/chat`, {
  withCredentials: true,
  transports: ['websocket'],
});
