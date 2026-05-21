import { app, ipcMain } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';
import { VaultState } from '../store/VaultState';
import { decryptData, encryptData } from '../utils/Crypto';

export const VAULT_FILE_PATH = path.join(app.getPath('userData'), 'vault.enc');

export function setupVaultIPCHandlers() {
  ipcMain.handle('create-vault', async (_event, masterPassword: string) => {
    try {
      console.log('Received request to create vault...');

      const initialDataString = JSON.stringify([]);
      const encryptedPackage = encryptData(initialDataString, masterPassword);

      await fs.writeFile(VAULT_FILE_PATH, JSON.stringify(encryptedPackage, null, 2), 'utf-8');
      VaultState.setKey(masterPassword);

      console.log('Vault created successfully:', VAULT_FILE_PATH);
      return { success: true };
    } catch (error) {
      console.error('Error creating vault:', error);
      throw new Error('Unable to create the local vault');
    }
  });

  ipcMain.handle('check-vault', async () => {
    try {
      await fs.access(VAULT_FILE_PATH);
      console.log('Vault found on disk!');
      return true;
    } catch (error) {
      console.log('No vault founded. First start.');
      return false;
    }
  });

  ipcMain.handle('unlock-vault', async (_event, masterPassword: string) => {
    try {
      const VAULT_FILE_PATH = path.join(app.getPath('userData'), 'vault.enc');

      const fileContent = await fs.readFile(VAULT_FILE_PATH, 'utf-8');
      const encryptedPackage = JSON.parse(fileContent);

      const decryptedString = decryptData(encryptedPackage, masterPassword);
      VaultState.setKey(masterPassword);

      console.log('Vault position:', app.getPath('userData'));
      console.log('Vault successfully unlocked!', decryptedString);

      return { success: true };
    } catch (error) {
      console.error('Failed to unlock vault (wrong password or invalid file).');
      throw new Error('Invalid master password.');
    }
  });

  ipcMain.handle('lock-vault', (_event) => {
    console.log('Vault locked.');
    VaultState.clearKey();
  });
}
