import { createContext } from 'react';
import type { Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connect: (token: string) => void;
  disconnect: () => void;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);
