import { ipcMain } from 'electron';
import { createVault, lockVault, unlockVault, vaultExsist } from '../services/VaultService';

export function setupVaultIPCHandlers() {
  ipcMain.handle('check-vault', async () => {
    return await vaultExsist();
  });

  ipcMain.handle('create-vault', async (_event, masterPassword: string) => {
    await createVault(masterPassword);
  });

  ipcMain.handle('lock-vault', (_event) => {
    lockVault();
  });

  ipcMain.handle('unlock-vault', async (_event, masterPassword: string) => {
    await unlockVault(masterPassword);
  });
}
