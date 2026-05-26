/// <reference types="vite/client" />
declare module 'shared-password-manager/theme' {
  const content: string;
  export default content;
}

interface Window {
  api: {
    createVault: (password: string) => Promise<{ success: boolean }>;
    checkVault: () => Promise<boolean>;
    unlockVault: (password: string) => Promise<{ success: boolean }>;
    lockVault: () => void;
    onVaultLocked: (callback: () => void) => () => void;
    onPasswordsImported: (callback: (data: any[]) => void) => () => void;
    savePasswords: (passwords: unknown[]) => Promise<void>;
    getPasswords: () => Promise<any[]>;
    checkBiometricAvailable: () => Promise<boolean>;
    checkBiometricConfigured: () => Promise<boolean>;
    setupBiometric: (password: string) => Promise<boolean>;
    unlockBiometric: () => Promise<boolean>;
  };
}
