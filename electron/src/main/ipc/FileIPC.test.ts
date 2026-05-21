import { BrowserWindow, dialog, ipcMain, Notification } from 'electron';
import fs from 'node:fs/promises';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { VaultState } from '../store/VaultState';
import { encryptData } from '../utils/Crypto';
import { importPasswordsFromFile, setupFileIPCHandlers } from './FileIPC';

vi.mock('electron', () => {
  const NotificationMock = vi.fn(function () {
    return { show: vi.fn() };
  });
  return {
    app: { getPath: vi.fn(() => '/mock-user-data') },
    ipcMain: { handle: vi.fn() },
    dialog: { showOpenDialog: vi.fn() },
    Notification: NotificationMock,
  };
});

vi.mock('node:fs/promises', () => ({
  default: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
}));

describe('FileIPC', () => {
  const handlers: Record<string, Function> = {};

  beforeEach(() => {
    vi.clearAllMocks();
    VaultState.clearKey();

    vi.mocked(ipcMain.handle).mockImplementation((channel, handler) => {
      handlers[channel] = handler;
    });

    setupFileIPCHandlers();
  });

  describe('save-passwords', () => {
    it('should throw an error if the vault is locked', async () => {
      await expect(handlers['save-passwords'](null, [])).rejects.toThrow(/locked/);
    });

    it('should create a new file if no previous data exists (ENOENT)', async () => {
      VaultState.setKey('my-secret-key');

      const enoentError = new Error('Not found') as any;
      enoentError.code = 'ENOENT';
      vi.mocked(fs.readFile).mockRejectedValue(enoentError);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      const newPasswords = [{ service: 'Test', username: 'u', password: 'p' }];
      const result = await handlers['save-passwords'](null, newPasswords);

      expect(result).toEqual({ success: true });
      expect(fs.writeFile).toHaveBeenCalled();
    });
  });

  describe('get-passwords', () => {
    it('should return an empty array if the vault file is missing (ENOENT)', async () => {
      VaultState.setKey('my-secret-key');

      const enoentError = new Error('Not found') as any;
      enoentError.code = 'ENOENT';
      vi.mocked(fs.readFile).mockRejectedValue(enoentError);

      const result = await handlers['get-passwords']();
      expect(result).toEqual([]);
    });

    it('should return decrypted passwords if file exists', async () => {
      VaultState.setKey('my-secret-key');

      const testData = [{ id: '1', service: 'Test' }];
      const encryptedPackage = encryptData(JSON.stringify(testData), 'my-secret-key');

      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(encryptedPackage));

      const result = await handlers['get-passwords']();
      expect(result).toEqual(testData);
    });
  });

  describe('importPasswordsFromFile', () => {
    let mockWindow: any;

    beforeEach(() => {
      mockWindow = {
        isDestroyed: vi.fn(() => false),
        webContents: { send: vi.fn() },
      };
    });

    it('should do nothing if dialog is canceled', async () => {
      vi.mocked(dialog.showOpenDialog).mockResolvedValue({ canceled: true, filePaths: [] });

      await importPasswordsFromFile(mockWindow as unknown as BrowserWindow);

      expect(fs.readFile).not.toHaveBeenCalled();
      expect(mockWindow.webContents.send).not.toHaveBeenCalled();
    });

    it('should show a notification if JSON is invalid', async () => {
      vi.mocked(dialog.showOpenDialog).mockResolvedValue({
        canceled: false,
        filePaths: ['/test.json'],
      });

      vi.mocked(fs.readFile).mockResolvedValue('not-a-json-string');

      await importPasswordsFromFile(mockWindow as unknown as BrowserWindow);

      expect(Notification).toHaveBeenCalled();
      expect(mockWindow.webContents.send).not.toHaveBeenCalled();
    });

    it('should send data to renderer if JSON is valid', async () => {
      vi.mocked(dialog.showOpenDialog).mockResolvedValue({
        canceled: false,
        filePaths: ['/test.json'],
      });

      const validData = [{ service: 's', username: 'u', password: 'p' }];
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(validData));

      await importPasswordsFromFile(mockWindow as unknown as BrowserWindow);

      expect(mockWindow.webContents.send).toHaveBeenCalledWith('passwords-imported', validData);
      expect(Notification).not.toHaveBeenCalled();
    });
  });
});
