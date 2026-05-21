import { BrowserWindow, Menu } from 'electron';
import { importPasswordsFromFile } from './ipc/FileIPC';
import { VaultState } from './store/VaultState';

export function createApplicationMenu(mainWindow: BrowserWindow) {
  const template: any = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Import Passwords',
          click: async () => {
            importPasswordsFromFile(mainWindow);
          },
        },
        { type: 'separator' },
        {
          label: 'Lock vault',
          click: () => {
            VaultState.clearKey();

            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.webContents.send('vault-locked');
            }
          },
        },
        { role: 'quit' },
      ],
    },
    { role: 'editMenu' },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
