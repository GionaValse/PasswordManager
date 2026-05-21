import { describe, expect, it } from 'vitest';
import { decryptData, encryptData } from './Crypto';

describe('Cryptography Utility', () => {
  const masterPassword = 'super-strong-master-password-123!';
  const secretData = JSON.stringify({ service: 'GitHub', username: 'dev', password: 'pwd' });

  it('should securely encrypt and then decrypt data with the correct password', () => {
    const encryptedPackage = encryptData(secretData, masterPassword);

    expect(encryptedPackage).toHaveProperty('salt');
    expect(encryptedPackage).toHaveProperty('iv');
    expect(encryptedPackage).toHaveProperty('authTag');
    expect(encryptedPackage).toHaveProperty('ciphertext');

    expect(encryptedPackage.ciphertext).not.toContain('GitHub');
    expect(encryptedPackage.ciphertext).not.toContain('dev');

    const decryptedString = decryptData(encryptedPackage, masterPassword);

    expect(decryptedString).toBe(secretData);
  });

  it('should throw an error when trying to decrypt with a wrong password', () => {
    const encryptedPackage = encryptData(secretData, masterPassword);

    expect(() => {
      decryptData(encryptedPackage, 'wrong-password');
    }).toThrow();
  });

  it('should throw an error if the encrypted package is missing required fields', () => {
    const corruptedPackage = {
      ciphertext: 'some-random-data',
    };

    expect(() => {
      decryptData(corruptedPackage, masterPassword);
    }).toThrow(/Invalid format/);
  });

  it('should produce completely different ciphertexts for the same data (due to random IV and Salt)', () => {
    const encrypted1 = encryptData(secretData, masterPassword);
    const encrypted2 = encryptData(secretData, masterPassword);

    expect(encrypted1.salt).not.toBe(encrypted2.salt);
    expect(encrypted1.iv).not.toBe(encrypted2.iv);
    expect(encrypted1.ciphertext).not.toBe(encrypted2.ciphertext);
  });
});
