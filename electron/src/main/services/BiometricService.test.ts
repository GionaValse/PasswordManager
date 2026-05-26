import crypto from 'crypto';
import { safeStorage } from 'electron';
import fs from 'node:fs';
import { KeyCreationOption, Passport } from 'passport-desktop';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { unlockVault } from '../services/VaultService';
import {
  configureBiometric,
  isBiometricAvailable,
  isBiometricConfigured,
  unlockVaultWithBiometric,
} from './BiometricService';

vi.mock('electron', () => ({
  app: { getPath: vi.fn(() => '/mock-user-data') },
  safeStorage: {
    encryptString: vi.fn(),
    decryptString: vi.fn(),
  },
}));

vi.mock('node:fs', () => ({
  default: {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
  },
}));

vi.mock('crypto', () => ({
  default: {
    randomBytes: vi.fn(),
  },
}));

vi.mock('../services/VaultService', () => ({
  unlockVault: vi.fn(),
}));

const mockCreateAccount = vi.fn();
const mockSign = vi.fn();

vi.mock('passport-desktop', () => {
  return {
    KeyCreationOption: { FailIfExists: 'FailIfExists' },

    Passport: vi.fn().mockImplementation(() => ({
      accountExists: true,
      createAccount: mockCreateAccount,
      sign: mockSign,
    })),
  };
});

Passport.available = vi.fn();

describe('BiometricService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isBiometricAvailable', () => {
    it('should return true if biometric is available', () => {
      vi.mocked(Passport.available).mockReturnValue(true);
      const result = isBiometricAvailable();
      expect(result).toBe(true);
    });

    it('should return false if biometric is unavailable', () => {
      vi.mocked(Passport.available).mockReturnValue(false);
      const result = isBiometricAvailable();
      expect(result).toBe(false);
    });
  });

  describe('isBiometricConfigured', () => {
    it('should return false if biometric is unavailable globally', () => {
      vi.mocked(Passport).mockImplementationOnce(function () {
        return {
          accountExists: false,
          createAccount: mockCreateAccount,
          sign: mockSign,
        } as unknown as Passport;
      });

      const result = isBiometricConfigured();
      expect(result).toBe(false);
    });

    it('should return false if account does not exist', () => {
      vi.mocked(Passport.available).mockReturnValue(true);

      vi.mocked(Passport).mockImplementationOnce(function () {
        return {
          accountExists: false,
          createAccount: mockCreateAccount,
          sign: mockSign,
        } as unknown as Passport;
      });

      vi.mocked(fs.existsSync).mockReturnValue(true);

      const result = isBiometricConfigured();
      expect(result).toBe(false);
    });

    it('should return false if config file is missing', () => {
      vi.mocked(Passport.available).mockReturnValue(true);

      vi.mocked(Passport).mockImplementationOnce(function () {
        return {
          accountExists: true,
          createAccount: mockCreateAccount,
          sign: mockSign,
        } as unknown as Passport;
      });

      vi.mocked(fs.existsSync).mockReturnValue(false);

      const result = isBiometricConfigured();
      expect(result).toBe(false);
    });

    it('should return true if account exists and file is present', () => {
      vi.mocked(Passport.available).mockReturnValue(true);
      vi.mocked(Passport).mockImplementationOnce(function () {
        return {
          accountExists: true,
          createAccount: mockCreateAccount,
          sign: mockSign,
        } as unknown as Passport;
      });
      vi.mocked(fs.existsSync).mockReturnValue(true);

      const result = isBiometricConfigured();
      expect(result).toBe(true);
    });
  });

  describe('configureBiometric', () => {
    it('should throw an error if biometric is not available', async () => {
      vi.mocked(Passport.available).mockReturnValue(false);

      await expect(configureBiometric('password123')).rejects.toThrow('Biometric not available');
    });

    it('should create an account if it does not exist and save encrypted password', async () => {
      vi.mocked(Passport.available).mockReturnValue(true);

      vi.mocked(Passport).mockImplementationOnce(function () {
        return {
          accountExists: false,
          createAccount: mockCreateAccount,
          sign: mockSign,
        } as unknown as Passport;
      });

      vi.mocked(safeStorage.encryptString).mockReturnValue(Buffer.from('encrypted-data'));

      await configureBiometric('password123');

      expect(mockCreateAccount).toHaveBeenCalledWith(KeyCreationOption.FailIfExists);

      expect(safeStorage.encryptString).toHaveBeenCalledWith('password123');

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.any(String),
        Buffer.from('encrypted-data'),
      );
    });

    it('should NOT create an account if it already exists, but still save password', async () => {
      vi.mocked(Passport.available).mockReturnValue(true);

      vi.mocked(Passport).mockImplementationOnce(function () {
        return {
          accountExists: true,
          createAccount: mockCreateAccount,
          sign: mockSign,
        } as unknown as Passport;
      });

      vi.mocked(safeStorage.encryptString).mockReturnValue(Buffer.from('encrypted-data'));

      await configureBiometric('password123');

      expect(mockCreateAccount).not.toHaveBeenCalled();

      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe('unlockVaultWithBiometric', () => {
    it('should throw an error if biometric is not configured', async () => {
      vi.mocked(Passport).mockImplementationOnce(function () {
        return {
          accountExists: false,
          createAccount: mockCreateAccount,
          sign: mockSign,
        } as unknown as Passport;
      });

      await expect(unlockVaultWithBiometric()).rejects.toThrow('Biometric not configured');
    });

    it('should prompt biometric, decrypt password, and unlock vault', async () => {
      vi.mocked(Passport.available).mockReturnValue(true);
      vi.mocked(Passport).mockImplementation(function () {
        return {
          accountExists: true,
          createAccount: mockCreateAccount,
          sign: mockSign,
        } as unknown as Passport;
      });
      vi.mocked(fs.existsSync).mockReturnValue(true);

      const fakeBuffer = Buffer.from('fake-challenge');
      vi.mocked(crypto.randomBytes as (size: number) => Buffer).mockReturnValue(fakeBuffer);

      mockSign.mockResolvedValue(undefined);

      vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from('encrypted-pass'));
      vi.mocked(safeStorage.decryptString).mockReturnValue('decrypted-master-password');
      vi.mocked(unlockVault).mockResolvedValue();

      await unlockVaultWithBiometric();

      expect(crypto.randomBytes).toHaveBeenCalledWith(32);
      expect(mockSign).toHaveBeenCalledWith(fakeBuffer);
      expect(fs.readFileSync).toHaveBeenCalledWith(expect.any(String));
      expect(safeStorage.decryptString).toHaveBeenCalledWith(Buffer.from('encrypted-pass'));
      expect(unlockVault).toHaveBeenCalledWith('decrypted-master-password');
    });

    it('should not unlock vault if biometric sign fails', async () => {
      vi.mocked(Passport.available).mockReturnValue(true);
      vi.mocked(Passport).mockImplementation(function () {
        return {
          accountExists: true,
          createAccount: mockCreateAccount,
          sign: mockSign,
        } as unknown as Passport;
      });
      vi.mocked(fs.existsSync).mockReturnValue(true);

      mockSign.mockRejectedValue(new Error('User cancelled'));

      await expect(unlockVaultWithBiometric()).rejects.toThrow('User cancelled');

      expect(fs.readFileSync).not.toHaveBeenCalled();
      expect(unlockVault).not.toHaveBeenCalled();
    });
  });
});
