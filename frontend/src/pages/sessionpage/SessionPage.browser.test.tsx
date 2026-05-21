import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { usersApi } from '../../apiconfig';
import SessionPage from './SessionPage';

vi.mock('../../apiconfig', () => ({
  usersApi: {
    usersControllerActiveSessions: vi.fn(),
  },
}));

const { mockSocket } = vi.hoisted(() => ({
  mockSocket: {
    id: 'socket-123',
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
}));

vi.mock('shared-password-manager/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('shared-password-manager/hooks')>();
  const React = await import('react');

  return {
    ...actual,
    useSocket: () => ({
      socket: mockSocket,
      isConnected: true,
    }),
    useAuth: () => ({
      user: { username: 'Gerry' },
    }),
    useModal: () => {
      const [activeModal, setActiveModal] = React.useState<string | null>(null);
      return {
        activeModal,
        open: (modalName: string) => setActiveModal(modalName),
        close: () => setActiveModal(null),
      };
    },
  };
});

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>{children}</MemoryRouter>
  </QueryClientProvider>
);

describe('SessionPage Component', () => {
  const mockSessions = [
    {
      socketId: 'socket-123',
      ip: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      connectedAt: new Date().toISOString(),
    },
    {
      socketId: 'socket-456',
      ip: '10.0.0.5',
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      connectedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();

    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the list of active sessions with device texts', async () => {
    (usersApi.usersControllerActiveSessions as any).mockResolvedValue(mockSessions);

    await render(<SessionPage />, { wrapper: Wrapper });

    await expect.element(page.getByText('Chrome su Windows')).toBeVisible();
    await expect.element(page.getByText('Safari su iOS')).toBeVisible();
    await expect.element(page.getByText('This device')).toBeVisible();

    await expect.element(page.getByTestId('test-session-close-action-socket-456')).toBeVisible();
  });

  it('should setup and cleanup socket listeners', async () => {
    const { unmount } = await render(<SessionPage />, { wrapper: Wrapper });

    expect(mockSocket.on).toHaveBeenCalledWith('new_session_alert', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('close_session_alert', expect.any(Function));

    unmount();

    expect(mockSocket.off).toHaveBeenCalledWith('new_session_alert', expect.any(Function));
  });

  it('should emit request_global_logout when confirming modal', async () => {
    (usersApi.usersControllerActiveSessions as any).mockResolvedValue(mockSessions);

    await render(<SessionPage />, { wrapper: Wrapper });

    const globalLogoutBtn = page.getByRole('button', { name: 'Close all sessions' });
    await globalLogoutBtn.click();

    const confirmBtn = page.getByRole('button', { name: 'Confirm' });
    await confirmBtn.click();

    expect(mockSocket.emit).toHaveBeenCalledWith('request_global_logout');
  });

  it('should emit request_logout with specific socketId when confirming single session modal', async () => {
    (usersApi.usersControllerActiveSessions as any).mockResolvedValue(mockSessions);

    await render(<SessionPage />, { wrapper: Wrapper });

    await expect.element(page.getByText('Chrome su Windows')).toBeVisible();

    const singleLogoutBtn = page.getByTestId('test-session-close-action-socket-456');
    await singleLogoutBtn.click();

    const modalHeading = page.getByRole('heading', { name: 'Close this session' });
    await expect.element(modalHeading).toBeVisible();

    const confirmBtn = page.getByRole('button', { name: 'Confirm' });
    await confirmBtn.click();

    expect(mockSocket.emit).toHaveBeenCalledWith('request_logout', { socketId: 'socket-456' });
  });

  it('should refresh the list when a socket event is received', async () => {
    (usersApi.usersControllerActiveSessions as any).mockResolvedValue(mockSessions);
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await render(<SessionPage />, { wrapper: Wrapper });

    const calls = mockSocket.on.mock.calls;
    const newSessionCall = calls.find((call) => call[0] === 'new_session_alert');

    expect(
      newSessionCall,
      'Socket listener for new_session_alert was not registered',
    ).toBeDefined();

    const handleNewSession = newSessionCall![1];
    handleNewSession({ message: 'New login', time: new Date() });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['user-sessions'] });
  });
});
