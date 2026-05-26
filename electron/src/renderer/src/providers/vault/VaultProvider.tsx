import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { VaultContext } from 'shared-password-manager/context';

interface VaultProviderProps {
  children: React.ReactNode;
}

export function VaultProvider({ children }: VaultProviderProps): React.JSX.Element {
  const [hasVault, setHasVault] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const queryClient = useQueryClient();

  const clearFrontendSession = useCallback(() => {
    setIsUnlocked(false);
    queryClient.removeQueries();
  }, [queryClient]);

  useEffect(() => {
    const checkInitialStatus = async () => {
      try {
        const exists = await window.api.checkVault();
        setHasVault(exists);
      } catch (error) {
        console.error('Failed to check vault status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialStatus();
  }, []);

  useEffect(() => {
    const cleanup = window.api.onVaultLocked(clearFrontendSession);

    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [clearFrontendSession]);

  const isVaultCreated = useCallback(() => hasVault, [hasVault]);
  const isVaultUnlocked = useCallback(() => isUnlocked, [isUnlocked]);

  const setupBiometric = useCallback(async (masterPassword: string) => {
    const isBiometricAvailable = await window.api.checkBiometricAvailable();
    const isBiometricConfigured = await window.api.checkBiometricConfigured();

    if (isBiometricAvailable && !isBiometricConfigured) {
      await window.api.setupBiometric(masterPassword);
    }
  }, []);

  const unlockBiometric = useCallback(async () => {
    const isBiometricConfigured = await window.api.checkBiometricConfigured();

    if (isBiometricConfigured) {
      await window.api.unlockBiometric();
      setIsUnlocked(true);
    }
  }, []);

  const create = useCallback(
    async (masterPassword: string) => {
      try {
        await window.api.createVault(masterPassword);
        await setupBiometric(masterPassword);

        setHasVault(true);
        setIsUnlocked(true);
      } catch (e: unknown) {
        console.error('Error creating vault', e);

        if (e instanceof Error) {
          let errorMessage = e.message || 'Unknown error';

          if (errorMessage.includes('Error: '))
            errorMessage = errorMessage.split('Error: ').pop()?.trim() || 'Unknown error';

          throw new Error(errorMessage);
        }

        throw e;
      }
    },
    [setupBiometric],
  );

  const unlock = useCallback(
    async (masterPassword: string) => {
      try {
        await window.api.unlockVault(masterPassword);
        await setupBiometric(masterPassword);

        setIsUnlocked(true);
      } catch (e: unknown) {
        console.error('Invalid password or corrupted vault', e);

        if (e instanceof Error) {
          let errorMessage = e.message || 'Unknown error';

          if (errorMessage.includes('Error: '))
            errorMessage = errorMessage.split('Error: ').pop()?.trim() || 'Unknown error';

          throw new Error(errorMessage);
        }

        throw e;
      }
    },
    [setupBiometric],
  );

  const lock = useCallback(() => {
    clearFrontendSession();
    window.api.lockVault();
  }, [clearFrontendSession]);

  const contextValue = useMemo(
    () => ({
      isVaultCreated,
      isVaultUnlocked,
      isLoading,
      create,
      unlock,
      lock,
      unlockBiometric,
    }),
    [isVaultCreated, isVaultUnlocked, isLoading, create, unlock, lock],
  );

  return <VaultContext.Provider value={contextValue}>{children}</VaultContext.Provider>;
}
