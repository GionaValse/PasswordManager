import { Menu } from 'electron';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApplicationMenu } from './MainMenu';
import { importPasswordsFromFile } from './ipc/FileIPC';
import { VaultState } from './store/VaultState';

vi.mock('electron', () => ({
  Menu: {
    buildFromTemplate: vi.fn((template) => template),
    setApplicationMenu: vi.fn(),
  },
}));

vi.mock('./ipc/FileIPC', () => ({
  importPasswordsFromFile: vi.fn(),
}));

vi.mock('./store/VaultState', () => ({
  VaultState: {
    clearKey: vi.fn(),
  },
}));

describe('MainMenu', () => {
  let mockWindow: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockWindow = {
      isDestroyed: vi.fn(() => false),
      webContents: { send: vi.fn() },
    };
  });

  it('should build and set the application menu', () => {
    createApplicationMenu(mockWindow);

    expect(Menu.buildFromTemplate).toHaveBeenCalled();
    expect(Menu.setApplicationMenu).toHaveBeenCalled();
  });

  it('should call importPasswordsFromFile when "Import Passwords" is clicked', () => {
    createApplicationMenu(mockWindow);

    const template = vi.mocked(Menu.buildFromTemplate).mock.results[0].value;

    const importMenuItem = template[0].submenu[0];
    expect(importMenuItem.label).toBe('Import Passwords');

    importMenuItem.click();

    expect(importPasswordsFromFile).toHaveBeenCalledWith(mockWindow);
  });

  it('should clear vault state and notify renderer when "Lock vault" is clicked', () => {
    createApplicationMenu(mockWindow);

    const template = vi.mocked(Menu.buildFromTemplate).mock.results[0].value;

    const lockMenuItem = template[0].submenu[2];
    expect(lockMenuItem.label).toBe('Lock vault');

    lockMenuItem.click();

    expect(VaultState.clearKey).toHaveBeenCalled();
    expect(mockWindow.webContents.send).toHaveBeenCalledWith('vault-locked');
  });
});
