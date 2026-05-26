import { ipcMain } from 'electron';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as VaultService from '../services/VaultService';
import { setupVaultIPCHandlers } from './VaultIPC';

vi.mock('electron', () => ({
  ipcMain: { handle: vi.fn() },
}));

vi.mock('../services/VaultService', () => {
  return {
    vaultExsist: vi.fn(),
    createVault: vi.fn(),
    lockVault: vi.fn(),
    unlockVault: vi.fn(),
  };
});

describe('VaultIPC', () => {
  const handlers: Record<string, Function> = {};

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(ipcMain.handle).mockImplementation((channel, handler) => {
      handlers[channel] = handler;
    });

    setupVaultIPCHandlers();
  });

  describe('check-vault', () => {
    it('should call vaultExsist service and return its result', async () => {
      vi.mocked(VaultService.vaultExsist).mockResolvedValue(true);

      const result = await handlers['check-vault']();

      expect(VaultService.vaultExsist).toHaveBeenCalledOnce();
      expect(result).toBe(true);
    });
  });

  describe('create-vault', () => {
    it('should call createVault service with the correct password', async () => {
      vi.mocked(VaultService.createVault).mockResolvedValue(undefined);

      await handlers['create-vault'](null, 'test-password');

      expect(VaultService.createVault).toHaveBeenCalledWith('test-password');
      expect(VaultService.createVault).toHaveBeenCalledOnce();
    });
  });

  describe('lock-vault', () => {
    it('should call lockVault service', async () => {
      vi.mocked(VaultService.lockVault).mockResolvedValue(undefined);

      await handlers['lock-vault'](null);

      expect(VaultService.lockVault).toHaveBeenCalledOnce();
    });
  });

  describe('unlock-vault', () => {
    it('should call unlockVault service with the correct password', async () => {
      vi.mocked(VaultService.unlockVault).mockResolvedValue(undefined);

      await handlers['unlock-vault'](null, 'test-password');

      expect(VaultService.unlockVault).toHaveBeenCalledWith('test-password');
      expect(VaultService.unlockVault).toHaveBeenCalledOnce();
    });
  });
});
