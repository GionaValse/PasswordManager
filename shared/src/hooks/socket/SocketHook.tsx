import { useContext } from 'react';
import { SocketContext } from '../../context/socket/SocketContext';

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketContext');
  }
  return context;
}
