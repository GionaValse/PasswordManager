import { useCallback, useState } from 'react';
import { SocketContext } from 'shared-password-manager/context';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

interface SocketProviderProps {
  children: React.ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const connect = useCallback(
    (token: string) => {
      if (socket?.connected) return;

      const url = import.meta.env.VITE_SOCKET_SERVER;

      const socketIo = io(url, {
        auth: { token },
      });

      socketIo.on('connect', () => {
        console.log('Socket Connected:', socketIo.id);
        setIsConnected(true);
      });

      socketIo.on('disconnect', () => {
        console.log('Socket Disconnected');
        setIsConnected(false);
      });

      setSocket(socketIo);
    },
    [socket],
  );

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
}
