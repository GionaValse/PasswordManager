import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge, ipcRenderer } from 'electron';

// Custom APIs for renderer
const api = {
  createVault: (password: string) => ipcRenderer.invoke('create-vault', password),
  checkVault: () => ipcRenderer.invoke('check-vault'),
  unlockVault: (password: string) => ipcRenderer.invoke('unlock-vault', password),
  lockVault: () => ipcRenderer.invoke('lock-vault'),
  onVaultLocked: (callback: () => void) => {
    ipcRenderer.removeAllListeners('vault-locked');
    ipcRenderer.on('vault-locked', () => callback());
  },
  onPasswordsImported: (callback: (data: any[]) => void) => {
    const listener = (_event: any, data: any) => callback(data);
    ipcRenderer.on('passwords-imported', listener);
    return () => ipcRenderer.removeListener('passwords-imported', listener);
  },
  savePasswords: (passwords: unknown[]) => ipcRenderer.invoke('save-passwords', passwords),
  getPasswords: (): Promise<any[]> => ipcRenderer.invoke('get-passwords'),
  checkBiometricAvailable: () => ipcRenderer.invoke('check-biometric-available'),
  checkBiometricConfigured: () => ipcRenderer.invoke('check-biometric-configured'),
  setupBiometric: (password: string) => ipcRenderer.invoke('setup-biometric', password),
  unlockBiometric: () => ipcRenderer.invoke('unlock-biometric'),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
