import * as SecureStore from 'expo-secure-store';
import { QrCodeDTO } from 'shared-password-manager';
import { PasswordService } from './password-service';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const mockedGetItemAsync = SecureStore.getItemAsync as jest.MockedFunction<
  typeof SecureStore.getItemAsync
>;
const mockedSetItemAsync = SecureStore.setItemAsync as jest.MockedFunction<
  typeof SecureStore.setItemAsync
>;
const mockedDeleteItemAsync = SecureStore.deleteItemAsync as jest.MockedFunction<
  typeof SecureStore.deleteItemAsync
>;

describe('PasswordService', () => {
  const mockQrCode: QrCodeDTO = {
    id: 'test-123',
    name: 'My Service',
    username: 'user@test.com',
    password: 'securePassword!',
  };

  const KEYS_LIST = 'password_keys';

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAll', () => {
    test('returns an empty array if no keys are found', async () => {
      mockedGetItemAsync.mockResolvedValueOnce(null);

      const result = await PasswordService.getAll();

      expect(mockedGetItemAsync).toHaveBeenCalledWith(KEYS_LIST);
      expect(result).toEqual([]);
    });

    test('retrieves and parses all stored passwords', async () => {
      mockedGetItemAsync.mockImplementation(async (key: string) => {
        if (key === KEYS_LIST) return JSON.stringify(['test-123']);
        if (key === 'pwd_test-123') return JSON.stringify(mockQrCode);
        return null;
      });

      const result = await PasswordService.getAll();

      expect(mockedGetItemAsync).toHaveBeenCalledTimes(2);
      expect(result).toEqual([mockQrCode]);
    });

    test('returns an empty array if an error occurs', async () => {
      mockedGetItemAsync.mockRejectedValueOnce(new Error('Storage failure'));

      const result = await PasswordService.getAll();

      expect(console.error).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    test('handles errors gracefully and returns an empty array', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockedGetItemAsync.mockRejectedValueOnce(new Error('SecureStore Corrupted'));

      const result = await PasswordService.getAll();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Errore nel caricamento:', expect.any(Error));
      consoleSpy.mockRestore();
    });

    test('skips passwords if the item in SecureStore returns null', async () => {
      mockedGetItemAsync.mockResolvedValueOnce(JSON.stringify(['ghost-id']));
      mockedGetItemAsync.mockResolvedValueOnce(null);

      const result = await PasswordService.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('save', () => {
    test('saves a new password and adds its ID to the keys list', async () => {
      mockedGetItemAsync.mockResolvedValueOnce(JSON.stringify(['existing-id']));

      await PasswordService.save(mockQrCode);

      expect(mockedSetItemAsync).toHaveBeenCalledWith(
        KEYS_LIST,
        JSON.stringify(['existing-id', 'test-123']),
      );
      expect(mockedSetItemAsync).toHaveBeenCalledWith('pwd_test-123', JSON.stringify(mockQrCode));
    });

    test('updates an existing password without duplicating its ID in the keys list', async () => {
      mockedGetItemAsync.mockResolvedValueOnce(JSON.stringify(['test-123']));

      await PasswordService.save(mockQrCode);

      expect(mockedSetItemAsync).not.toHaveBeenCalledWith(KEYS_LIST, expect.anything());
      expect(mockedSetItemAsync).toHaveBeenCalledWith('pwd_test-123', JSON.stringify(mockQrCode));
    });

    test('throws an error if saving fails', async () => {
      mockedGetItemAsync.mockRejectedValueOnce(new Error('Write failure'));

      await expect(PasswordService.save(mockQrCode)).rejects.toThrow('Write failure');
      expect(console.error).toHaveBeenCalled();
    });

    test('handles null existing keys and throws on error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      mockedGetItemAsync.mockResolvedValueOnce(null);
      mockedSetItemAsync.mockRejectedValueOnce(new Error('Save Error'));

      await expect(
        PasswordService.save({ id: '123', name: 'Test', username: 'u', password: 'p' }),
      ).rejects.toThrow('Save Error');

      expect(consoleSpy).toHaveBeenCalledWith('Errore durante il salvataggio:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('delete', () => {
    test('removes the ID from the keys list and deletes the password', async () => {
      mockedGetItemAsync.mockResolvedValueOnce(JSON.stringify(['existing-id', 'test-123']));

      await PasswordService.delete('test-123');

      expect(mockedSetItemAsync).toHaveBeenCalledWith(KEYS_LIST, JSON.stringify(['existing-id']));
      expect(mockedDeleteItemAsync).toHaveBeenCalledWith('pwd_test-123');
    });

    test('throws an error if deletion fails', async () => {
      mockedGetItemAsync.mockRejectedValueOnce(new Error('Delete failure'));

      await expect(PasswordService.delete('test-123')).rejects.toThrow('Delete failure');
      expect(console.error).toHaveBeenCalled();
    });

    test('handles null existing keys and throws on error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      mockedGetItemAsync.mockResolvedValueOnce(null);
      mockedDeleteItemAsync.mockRejectedValueOnce(new Error('Delete Error'));

      await expect(PasswordService.delete('123')).rejects.toThrow('Delete Error');
      expect(consoleSpy).toHaveBeenCalledWith("Errore durante l'eliminazione:", expect.any(Error));
      consoleSpy.mockRestore();
    });
  });
});
