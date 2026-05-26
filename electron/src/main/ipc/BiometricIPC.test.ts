import { ipcMain } from 'electron';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as BiometricService from '../services/BiometricService';
import { setupBiometricIPCHandlers } from './BiometricIPC';

vi.mock('electron', () => ({
  ipcMain: { handle: vi.fn() },
}));

vi.mock('../services/BiometricService', () => ({
  configureBiometric: vi.fn(),
  isBiometricAvailable: vi.fn(),
  isBiometricConfigured: vi.fn(),
  unlockVaultWithBiometric: vi.fn(),
}));

describe('BiometricIPC', () => {
  const handlers: Record<string, Function> = {};

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(ipcMain.handle).mockImplementation((channel, handler) => {
      handlers[channel] = handler;
    });

    setupBiometricIPCHandlers();
  });

  describe('check-biometric-available', () => {
    it('should call isBiometricAvailable service and return its result', async () => {
      vi.mocked(BiometricService.isBiometricAvailable).mockReturnValue(true);

      const result = await handlers['check-biometric-available']();

      expect(BiometricService.isBiometricAvailable).toHaveBeenCalledOnce();

      expect(result).toBe(true);
    });
  });

  describe('check-biometric-configured', () => {
    it('should call isBiometricConfigured service and return its result', async () => {
      vi.mocked(BiometricService.isBiometricConfigured).mockReturnValue(true);

      const result = await handlers['check-biometric-configured']();

      expect(BiometricService.isBiometricConfigured).toHaveBeenCalledOnce();
      expect(result).toBe(true);
    });
  });

  describe('setup-biometric', () => {
    it('should call configureBiometric service with the correct password', async () => {
      vi.mocked(BiometricService.configureBiometric).mockResolvedValue(undefined);

      await handlers['setup-biometric'](null, 'test-password');

      expect(BiometricService.configureBiometric).toHaveBeenCalledWith('test-password');
      expect(BiometricService.configureBiometric).toHaveBeenCalledOnce();
    });
  });

  describe('unlock-biometric', () => {
    it('should call unlockVaultWithBiometric service', async () => {
      vi.mocked(BiometricService.unlockVaultWithBiometric).mockResolvedValue(undefined);

      await handlers['unlock-biometric']();

      expect(BiometricService.unlockVaultWithBiometric).toHaveBeenCalledOnce();
    });
  });
});
