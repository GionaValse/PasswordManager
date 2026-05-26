import { ipcMain } from 'electron';
import {
  configureBiometric,
  isBiometricAvailable,
  isBiometricConfigured,
  unlockVaultWithBiometric,
} from '../services/BiometricService';

export function setupBiometricIPCHandlers() {
  ipcMain.handle('check-biometric-available', (): boolean => {
    return isBiometricAvailable();
  });

  ipcMain.handle('check-biometric-configured', (): boolean => {
    return isBiometricConfigured();
  });

  ipcMain.handle('setup-biometric', async (_, masterPassword) => {
    await configureBiometric(masterPassword);
  });

  ipcMain.handle('unlock-biometric', async () => {
    await unlockVaultWithBiometric();
  });
}
