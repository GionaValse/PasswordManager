import { vi } from 'vitest';

const mockApi = {
  createVault: vi.fn().mockResolvedValue({ success: true }),
  checkVault: vi.fn().mockResolvedValue(true),
  unlockVault: vi.fn().mockResolvedValue({ success: true }),
  lockVault: vi.fn(),
  onVaultLocked: vi.fn(),

  onPasswordsImported: vi.fn().mockReturnValue(vi.fn()),

  savePasswords: vi.fn().mockResolvedValue(undefined),
  getPasswords: vi.fn().mockResolvedValue([]),
};

Object.defineProperty(window, 'api', {
  value: mockApi,
  writable: true,
});

Object.defineProperty(window, 'electron', {
  value: {
    ipcRenderer: {
      send: vi.fn(),
      invoke: vi.fn(),
      on: vi.fn(),
    },
  },
  writable: true,
});
