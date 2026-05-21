import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { SocketContext } from '../../context/socket/SocketContext';
import { useSocket } from './SocketHook';

describe('useSocket Custom Hook', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return context value when used within SocketContext', async () => {
    const mockContextValue = {
      socket: null,
      isConnected: true,
      connect: vi.fn(),
      disconnect: vi.fn(),
    } as any;

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SocketContext.Provider value={mockContextValue}>{children}</SocketContext.Provider>
    );

    const { result } = await renderHook(() => useSocket(), { wrapper });

    expect(result.current).toBe(mockContextValue);
    expect(result.current.isConnected).toBe(true);
  });

  it('should throw an error when used outside of SocketContext', async () => {
    await expect(async () => {
      await renderHook(() => useSocket());
    }).rejects.toThrow('useSocket must be used within SocketContext');
  });
});
