import { ipcMain } from 'electron';
import fs from 'node:fs/promises';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { VaultState } from '../store/VaultState';
import { setupVaultIPCHandlers } from './VaultIPC';

vi.mock('electron', () => ({
  app: { getPath: vi.fn(() => '/mock-user-data') },
  ipcMain: { handle: vi.fn() },
}));

vi.mock('node:fs/promises', () => ({
  default: {
    access: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
}));

describe('VaultIPC', () => {
  const handlers: Record<string, Function> = {};

  beforeEach(() => {
    vi.clearAllMocks();
    VaultState.clearKey();

    vi.mocked(ipcMain.handle).mockImplementation((channel, handler) => {
      handlers[channel] = handler;
    });

    setupVaultIPCHandlers();
  });

  describe('check-vault', () => {
    it('should return true if the vault file exists', async () => {
      vi.mocked(fs.access).mockResolvedValue(undefined);

      const result = await handlers['check-vault']();
      expect(result).toBe(true);
    });

    it('should return false if the vault file does not exist', async () => {
      vi.mocked(fs.access).mockRejectedValue(new Error('ENOENT'));

      const result = await handlers['check-vault']();
      expect(result).toBe(false);
    });
  });

  describe('create-vault', () => {
    it('should create a vault, save it to disk, and set the state key', async () => {
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      const result = await handlers['create-vault'](null, 'master-pass');

      expect(fs.writeFile).toHaveBeenCalled();

      expect(VaultState.getKey()).toBe('master-pass');
      expect(result).toEqual({ success: true });
    });
  });

  describe('lock-vault', () => {
    it('should clear the VaultState key', () => {
      VaultState.setKey('some-key');
      expect(VaultState.isUnlocked()).toBe(true);

      handlers['lock-vault']();

      expect(VaultState.isUnlocked()).toBe(false);
    });
  });
});
