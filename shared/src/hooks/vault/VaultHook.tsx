import { useContext } from 'react';
import { VaultContext } from '../../context/vault/VaultContext';

export function useVault() {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within VaultContext');
  }
  return context;
}
