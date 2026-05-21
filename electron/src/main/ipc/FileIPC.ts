import { BrowserWindow, dialog, ipcMain, Notification } from 'electron';
import fs from 'node:fs/promises';
import { VaultState } from '../store/VaultState';
import { decryptData, encryptData } from '../utils/Crypto';
import { VAULT_FILE_PATH } from './VaultIPC';

export function setupFileIPCHandlers() {
  ipcMain.handle('save-passwords', async (_event, passwords: any[]) => {
    try {
      let currentPasswords: any[] = [];
      const sessionKey = VaultState.getKey();

      if (!sessionKey) throw new Error('Vault is not locked.');

      try {
        const fileContent = await fs.readFile(VAULT_FILE_PATH, 'utf-8');
        const encryptedPackage = JSON.parse(fileContent);
        const decriptedContent = decryptData(encryptedPackage, sessionKey);

        currentPasswords = JSON.parse(decriptedContent);
      } catch (error: any) {
        if (error.code !== 'ENOENT') throw error;
      }

      const mergedPasswords = [...currentPasswords, ...passwords];
      const saveData = JSON.stringify(mergedPasswords, null, 2);
      const encryptedData = encryptData(saveData, sessionKey);

      await fs.writeFile(VAULT_FILE_PATH, JSON.stringify(encryptedData, null, 2), 'utf-8');

      return { success: true };
    } catch (error: any) {
      console.error('Error saving passwords:', error);
      throw error;
    }
  });

  ipcMain.handle('get-passwords', async () => {
    const sessionKey = VaultState.getKey();

    if (!sessionKey) {
      throw new Error('Vault is locked! Impossibile leggere i dati.');
    }

    try {
      const fileContent = await fs.readFile(VAULT_FILE_PATH, 'utf-8');
      const encryptedPackage = JSON.parse(fileContent);
      const decryptedString = decryptData(encryptedPackage, sessionKey);

      return JSON.parse(decryptedString);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return [];
      }

      console.error('Errore durante la lettura o decrittografia del vault:', error);
      throw new Error('Impossibile leggere il vault. File corrotto o chiave non valida.');
    }
  });
}

export async function importPasswordsFromFile(mainWindow: BrowserWindow): Promise<void> {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'JSON Files', extensions: ['json'] }],
  });

  if (canceled || filePaths.length === 0) {
    return;
  }

  try {
    const content = await fs.readFile(filePaths[0], 'utf-8');
    const passwords = JSON.parse(content);

    if (!Array.isArray(passwords)) {
      throw new Error('Incorrect file format: must contain an array of objects.');
    }

    const isValid = passwords.every(
      (entry: any) => entry.service && entry.username && entry.password,
    );

    if (!isValid) {
      throw new Error('Incorrect file format: must contain service, username and password.');
    }

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('passwords-imported', passwords);
    }
  } catch (err: any) {
    console.error('Error reading file:', err);

    new Notification({
      title: 'Import Error',
      body: err.message || 'Failed to read or parse the JSON file.',
    }).show();
  }
}
