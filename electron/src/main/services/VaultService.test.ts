import fs from 'node:fs/promises';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { VaultState } from '../store/VaultState';
import { decryptData, encryptData } from '../utils/Crypto';
import { createVault, lockVault, unlockVault, vaultExsist } from './VaultService';

vi.mock('electron', () => ({
  app: { getPath: vi.fn(() => '/mock-user-data') },
}));

vi.mock('node:fs/promises', () => ({
  default: {
    access: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
}));

vi.mock('../utils/Crypto', () => ({
  decryptData: vi.fn(),
  encryptData: vi.fn(),
}));

describe('VaultService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    VaultState.clearKey();
  });

  describe('vaultExsist', () => {
    it('should return true if the vault file exists', async () => {
      vi.mocked(fs.access).mockResolvedValue(undefined);

      const result = await vaultExsist();
      expect(result).toBe(true);
    });

    it('should return false if the vault file does not exist', async () => {
      vi.mocked(fs.access).mockRejectedValue(new Error('ENOENT'));

      const result = await vaultExsist();
      expect(result).toBe(false);
    });
  });

  describe('createVault', () => {
    it('should not create a vault if it already exists', async () => {
      vi.mocked(fs.access).mockResolvedValue(undefined);

      await expect(createVault('test-password')).rejects.toThrow('Vault already exists.');
    });

    it('should throw error if not able to create vault', async () => {
      vi.mocked(fs.access).mockRejectedValue(new Error('ENOENT'));
      vi.mocked(fs.writeFile).mockRejectedValue(new Error('Disk Full'));

      await expect(createVault('test-password')).rejects.toThrow(
        'Unable to create the local vault',
      );
    });

    it('should create a local vault', async () => {
      vi.mocked(fs.access).mockRejectedValue(new Error('ENOENT'));
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      vi.mocked(encryptData).mockReturnValue({ salt: 'salt', iv: 'iv', data: 'data' } as any);

      const masterPassword = 'test-password';
      await createVault(masterPassword);

      expect(VaultState.getKey()).toBe(masterPassword);
      expect(fs.writeFile).toHaveBeenCalled();
    });
  });

  describe('lockVault', () => {
    it('should clear the VaultState key', () => {
      VaultState.setKey('some-key');
      expect(VaultState.isUnlocked()).toBe(true);

      lockVault();

      expect(VaultState.isUnlocked()).toBe(false);
    });
  });

  describe('unlockVault', () => {
    it('should not unlock the vault if the password is wrong', async () => {
      const masterPassword = 'wrong-password';
      const fileContent = JSON.stringify({ salt: '...', iv: '...', data: '...' });

      vi.mocked(fs.readFile).mockResolvedValue(fileContent);

      vi.mocked(decryptData).mockImplementation(() => {
        throw new Error('Invalid password');
      });

      await expect(unlockVault(masterPassword)).rejects.toThrow('Invalid password.');
      expect(VaultState.isUnlocked()).toBe(false);
    });

    it('should unlock the vault if the password is correct', async () => {
      const masterPassword = 'correct-password';
      const fileContent = JSON.stringify({ salt: '...', iv: '...', data: '...' });

      vi.mocked(fs.readFile).mockResolvedValue(fileContent);
      vi.mocked(decryptData).mockReturnValue('decrypted-data' as any);

      await unlockVault(masterPassword);

      expect(VaultState.isUnlocked()).toBe(true);
      expect(VaultState.getKey()).toBe(masterPassword);
      expect(fs.readFile).toHaveBeenCalledWith(expect.any(String), 'utf-8');
    });
  });
});
