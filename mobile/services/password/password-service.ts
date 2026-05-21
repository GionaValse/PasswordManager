import * as SecureStore from 'expo-secure-store';
import { QrCodeDTO } from 'shared-password-manager';

const KEYS_LIST = 'password_keys';

export const PasswordService = {
  async getAll(): Promise<QrCodeDTO[]> {
    try {
      const keysJson = await SecureStore.getItemAsync(KEYS_LIST);
      if (!keysJson) return [];

      const keys: string[] = JSON.parse(keysJson);
      const loadedPasswords: QrCodeDTO[] = [];

      for (const id of keys) {
        const pwdJson = await SecureStore.getItemAsync(`pwd_${id}`);
        if (pwdJson) {
          loadedPasswords.push(JSON.parse(pwdJson));
        }
      }
      return loadedPasswords;
    } catch (error) {
      console.error('Errore nel caricamento:', error);
      return [];
    }
  },

  async save(data: QrCodeDTO): Promise<void> {
    try {
      const existingKeysJson = await SecureStore.getItemAsync(KEYS_LIST);
      const existingKeys: string[] = existingKeysJson ? JSON.parse(existingKeysJson) : [];

      if (!existingKeys.includes(data.id)) {
        existingKeys.push(data.id);
        await SecureStore.setItemAsync(KEYS_LIST, JSON.stringify(existingKeys));
      }

      await SecureStore.setItemAsync(`pwd_${data.id}`, JSON.stringify(data));
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const keysJson = await SecureStore.getItemAsync(KEYS_LIST);
      const keys: string[] = keysJson ? JSON.parse(keysJson) : [];
      const newKeys = keys.filter((k) => k !== id);

      await SecureStore.setItemAsync(KEYS_LIST, JSON.stringify(newKeys));
      await SecureStore.deleteItemAsync(`pwd_${id}`);
    } catch (error) {
      console.error("Errore durante l'eliminazione:", error);
      throw error;
    }
  },
};
