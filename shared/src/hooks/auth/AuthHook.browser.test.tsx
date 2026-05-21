import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { AuthContext } from '../../context/auth/AuthContext';
import { useAuth } from './AuthHook';

describe('useAuth Custom Hook', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return context value when used within AuthContext', async () => {
    const mockContextValue = {
      user: { username: 'Gerry' },
      isAuthenticated: vi.fn().mockReturnValue(true),
      login: vi.fn(),
      logout: vi.fn(),
    } as any;

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={mockContextValue}>{children}</AuthContext.Provider>
    );

    const { result } = await renderHook(() => useAuth(), { wrapper });

    expect(result.current).toBe(mockContextValue);
    expect(result.current.user?.username).toBe('Gerry');
  });

  it('should throw an error when used outside of AuthContext', async () => {
    await expect(async () => {
      await renderHook(() => useAuth());
    }).rejects.toThrow('useAuth must be used within AuthContext');
  });
});
