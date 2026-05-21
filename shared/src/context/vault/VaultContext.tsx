import { createContext } from 'react';

interface VaultContextType {
  isVaultCreated: () => boolean;
  isVaultUnlocked: () => boolean;
  isLoading: boolean;
  create: (masterPassword: string) => Promise<void>;
  unlock: (masterPassword: string) => Promise<void>;
  lock: () => void;
}

export const VaultContext = createContext<VaultContextType | undefined>(undefined);
