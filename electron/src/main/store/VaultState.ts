let sessionKey: string | null = null;

export const VaultState = {
  setKey: (key: string) => {
    sessionKey = key;
  },

  getKey: () => {
    return sessionKey;
  },

  clearKey: () => {
    sessionKey = null;
  },

  isUnlocked: () => {
    return sessionKey !== null;
  },
};
