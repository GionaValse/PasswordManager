import { beforeEach, describe, expect, it } from 'vitest';
import { VaultState } from './VaultState';

describe('VaultState', () => {
  beforeEach(() => {
    VaultState.clearKey();
  });

  it('should initially be locked and have no key', () => {
    expect(VaultState.getKey()).toBeNull();
    expect(VaultState.isUnlocked()).toBe(false);
  });

  it('should securely save the key and report as unlocked', () => {
    const testKey = 'my-super-secret-password';

    VaultState.setKey(testKey);

    expect(VaultState.getKey()).toBe(testKey);
    expect(VaultState.isUnlocked()).toBe(true);
  });

  it('should clear the key and lock the vault when clearKey is called', () => {
    VaultState.setKey('temporary-key');
    expect(VaultState.isUnlocked()).toBe(true);

    VaultState.clearKey();

    expect(VaultState.getKey()).toBeNull();
    expect(VaultState.isUnlocked()).toBe(false);
  });
});
