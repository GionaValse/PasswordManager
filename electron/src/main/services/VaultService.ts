import { app } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';
import { VaultState } from '../store/VaultState';
import { decryptData, encryptData } from '../utils/Crypto';

export const VAULT_FILE_PATH = path.join(app.getPath('userData'), 'vault.enc');

export async function vaultExsist(): Promise<boolean> {
  try {
    await fs.access(VAULT_FILE_PATH);
    console.log('Vault found on disk!');
    return true;
  } catch (error) {
    console.log('No vault founded. First start.');
    return false;
  }
}

export async function createVault(masterPassword: string) {
  if (await vaultExsist()) {
    throw new Error('Vault already exists.');
  }

  try {
    const initialDataString = JSON.stringify([]);
    const encryptedPackage = encryptData(initialDataString, masterPassword);

    await fs.writeFile(VAULT_FILE_PATH, JSON.stringify(encryptedPackage, null, 2), 'utf-8');
    VaultState.setKey(masterPassword);

    console.log('Vault created successfully:', VAULT_FILE_PATH);
  } catch (error) {
    console.error('Error creating vault:', error);
    throw new Error('Unable to create the local vault');
  }
}

export async function lockVault() {
  VaultState.clearKey();
}

export async function unlockVault(masterPassword: string) {
  try {
    const fileContent = await fs.readFile(VAULT_FILE_PATH, 'utf-8');
    const encryptedPackage = JSON.parse(fileContent);

    decryptData(encryptedPackage, masterPassword);
    VaultState.setKey(masterPassword);
  } catch (error) {
    console.error('Failed to unlock vault (wrong password or invalid file).');
    throw new Error('Invalid password.');
  }
}
