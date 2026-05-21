import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { VaultContext } from '../../context/vault/VaultContext';
import { useVault } from './VaultHook';

describe('useVault Custom Hook', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return context value when used within VaultContext', async () => {
    const mockContextValue = {
      isVaultCreated: vi.fn().mockReturnValue(true),
      isVaultUnlocked: vi.fn().mockReturnValue(false),
      isLoading: false,
      create: vi.fn(),
      unlock: vi.fn(),
      lock: vi.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <VaultContext.Provider value={mockContextValue}>{children}</VaultContext.Provider>
    );

    const { result } = await renderHook(() => useVault(), { wrapper });

    expect(result.current).toBe(mockContextValue);
    expect(result.current.isVaultCreated()).toBe(true);
    expect(result.current.isVaultUnlocked()).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should throw an error when used outside of VaultContext', async () => {
    await expect(async () => {
      await renderHook(() => useVault());
    }).rejects.toThrow(/useVault must be used within VaultContext/i);
  });
});
