import crypto from 'crypto';
import { app, safeStorage } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { KeyCreationOption, Passport } from 'passport-desktop';
import { unlockVault } from '../services/VaultService';

const HELLO_CONFIG_PATH = path.join(app.getPath('userData'), 'hello-config.bin');
const APP_NAME = 'password-manager-hello';

export function isBiometricAvailable(): boolean {
  return Passport.available();
}

export function isBiometricConfigured(): boolean {
  if (!isBiometricAvailable) return false;

  const passport = new Passport(APP_NAME);
  return passport.accountExists && fs.existsSync(HELLO_CONFIG_PATH);
}

export async function configureBiometric(masterPassword: string) {
  if (!isBiometricAvailable()) throw new Error('Biometric not available');

  const passport = new Passport(APP_NAME);
  if (!passport.accountExists) {
    await passport.createAccount(KeyCreationOption.FailIfExists);
  }

  const encrypted = safeStorage.encryptString(masterPassword);
  fs.writeFileSync(HELLO_CONFIG_PATH, encrypted);
}

export async function unlockVaultWithBiometric() {
  if (!isBiometricConfigured()) throw new Error('Biometric not configured');

  const passport = new Passport(APP_NAME);
  const challenge = crypto.randomBytes(32);
  await passport.sign(challenge);

  const encryptedPassword = fs.readFileSync(HELLO_CONFIG_PATH);
  const decryptedPassword = safeStorage.decryptString(encryptedPassword);

  await unlockVault(decryptedPassword);
}
