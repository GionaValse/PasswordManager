import { useSocket } from 'shared-password-manager/hooks';
import { io } from 'socket.io-client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { SocketProvider } from './SocketProvider';

vi.mock('socket.io-client', () => {
  const mSocket = {
    on: vi.fn(),
    disconnect: vi.fn(),
    connected: false,
    id: 'mock-id-123',
  };
  return {
    io: vi.fn(() => mSocket),
    default: vi.fn(() => mSocket),
  };
});

describe('SocketProvider Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SocketProvider>{children}</SocketProvider>
  );

  it('should initialize with disconnected state', async () => {
    const { result } = await renderHook(() => useSocket(), { wrapper });

    expect(result.current.socket).toBeNull();
    expect(result.current.isConnected).toBe(false);
  });

  it('should connect and update isConnected when socket emits connect event', async () => {
    const { result } = await renderHook(() => useSocket(), { wrapper });
    const mockToken = 'fake-token';

    result.current.connect(mockToken);

    expect(io).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        auth: { token: mockToken },
      }),
    );

    const mSocket = vi.mocked(io).mock.results[0].value;

    const connectCallback = mSocket.on.mock.calls.find((call: any[]) => call[0] === 'connect')?.[1];
    expect(connectCallback).toBeDefined();

    connectCallback();

    await vi.waitFor(() => {
      expect(result.current.isConnected).toBe(true);
      expect(result.current.socket).not.toBeNull();
    });
  });

  it('should not reconnect if already connected', async () => {
    const { result } = await renderHook(() => useSocket(), { wrapper });

    result.current.connect('token1');

    const mSocket = vi.mocked(io).mock.results[0].value;
    mSocket.connected = true;

    await vi.waitFor(() => {
      expect(result.current.socket).not.toBeNull();
    });

    result.current.connect('token2');

    expect(io).toHaveBeenCalledTimes(1);
  });

  it('should disconnect and cleanup state', async () => {
    const { result } = await renderHook(() => useSocket(), { wrapper });

    result.current.connect('token');

    await vi.waitFor(() => {
      expect(result.current.socket).not.toBeNull();
    });

    const mSocket = vi.mocked(io).mock.results[0].value;
    result.current.disconnect();

    await vi.waitFor(() => {
      expect(result.current.socket).toBeNull();
    });

    expect(mSocket.disconnect).toHaveBeenCalled();
    expect(result.current.isConnected).toBe(false);
  });
});
