import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from 'shared-password-manager/hooks';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { authApi, usersApi } from '../../apiconfig';
import { AuthProvider } from './AuthProvider';

vi.mock('../../apiconfig', () => ({
  authApi: {
    authControllerSignIn: vi.fn(),
    authControllerRegister: vi.fn(),
  },
  usersApi: {
    usersControllerFindMe: vi.fn(),
  },
}));

const { mockSocket, mockConnect, mockDisconnect } = vi.hoisted(() => {
  return {
    mockSocket: {
      on: vi.fn(),
      off: vi.fn(),
    },
    mockConnect: vi.fn(),
    mockDisconnect: vi.fn(),
  };
});

vi.mock('shared-password-manager/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('shared-password-manager/hooks')>();

  return {
    ...actual,
    useSocket: () => ({
      socket: mockSocket,
      connect: mockConnect,
      disconnect: mockDisconnect,
    }),
  };
});

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

describe('AuthProvider Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={createTestQueryClient()}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );

  it('should login and save token to localStorage', async () => {
    const mockToken = 'fake-jwt-token';
    const mockUser = { id: '1', username: 'Gerry' };

    vi.mocked(authApi.authControllerSignIn).mockResolvedValue({ accessToken: mockToken });
    vi.mocked(usersApi.usersControllerFindMe).mockResolvedValue(mockUser as any);

    const { result } = await renderHook(() => useAuth(), { wrapper });

    await result.current.login({ email: 'gerry@example.com', username: 'gerry', password: '123' });

    expect(localStorage.getItem('token')).toBe(mockToken);
    expect(authApi.authControllerSignIn).toHaveBeenCalled();

    await vi.waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated()).toBe(true);
    });

    expect(mockConnect).toHaveBeenCalledWith(mockToken);
  });

  it('should logout correctly and clear state', async () => {
    localStorage.setItem('token', 'old-token');
    const { result } = await renderHook(() => useAuth(), { wrapper });

    result.current.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated()).toBe(false);
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('should handle force_logout event from socket', async () => {
    localStorage.setItem('token', 'active-token');
    const { result } = await renderHook(() => useAuth(), { wrapper });

    const handleForceLogout = mockSocket.on.mock.calls.find(
      (call) => call[0] === 'force_logout',
    )?.[1];

    expect(handleForceLogout).toBeDefined();

    handleForceLogout({ message: 'Security breach!' });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should clear token if usersControllerFindMe fails', async () => {
    localStorage.setItem('token', 'invalid-token');

    vi.mocked(usersApi.usersControllerFindMe).mockRejectedValue(new Error('Unauthorized'));

    const { result } = await renderHook(() => useAuth(), { wrapper });

    await vi.waitFor(() => {
      expect(localStorage.getItem('token')).toBeNull();
      expect(result.current.user).toBeNull();
    });

    expect(mockDisconnect).toHaveBeenCalled();
  });
});
