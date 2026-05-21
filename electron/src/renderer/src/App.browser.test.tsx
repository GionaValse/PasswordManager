import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import App from './App';

import { useVault } from 'shared-password-manager/hooks/vault/VaultHook.js';

vi.mock('shared-password-manager/hooks/vault/VaultHook.js', () => ({
  useVault: vi.fn(),
}));

vi.mock('./pages/setuppage/SetupPage', () => ({
  default: () => <div data-testid="mock-setup-page">Setup</div>,
}));
vi.mock('./pages/loginpage/LoginPage', () => ({
  default: () => <div data-testid="mock-login-page">Login</div>,
}));
vi.mock('./pages/passwordlistpage/PasswordListPage', () => ({
  default: () => <div data-testid="mock-list-page">List</div>,
}));
vi.mock('./pages/importpreviewpage/ImportPreviewPage', () => ({
  default: () => <div data-testid="mock-import-page">Import</div>,
}));

describe('App Routing Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /setup when the vault is NOT created', async () => {
    vi.mocked(useVault).mockReturnValue({
      isVaultCreated: () => false,
      isVaultUnlocked: () => false,
      isLoading: false,
      create: vi.fn(),
      unlock: vi.fn(),
      lock: vi.fn(),
    });

    await render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    await expect.element(page.getByTestId('mock-setup-page')).toBeInTheDocument();
  });

  it('redirects to /login when the vault is created but LOCKED', async () => {
    vi.mocked(useVault).mockReturnValue({
      isVaultCreated: () => true,
      isVaultUnlocked: () => false,
      isLoading: false,
      create: vi.fn(),
      unlock: vi.fn(),
      lock: vi.fn(),
    });

    await render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    await expect.element(page.getByTestId('mock-login-page')).toBeInTheDocument();
  });

  it('allows access to the Password List when the vault is UNLOCKED', async () => {
    vi.mocked(useVault).mockReturnValue({
      isVaultCreated: () => true,
      isVaultUnlocked: () => true,
      isLoading: false,
      create: vi.fn(),
      unlock: vi.fn(),
      lock: vi.fn(),
    });

    await render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    await expect.element(page.getByTestId('mock-list-page')).toBeInTheDocument();
  });

  it('allows access to the Import Preview page when unlocked', async () => {
    vi.mocked(useVault).mockReturnValue({
      isVaultCreated: () => true,
      isVaultUnlocked: () => true,
      isLoading: false,
      create: vi.fn(),
      unlock: vi.fn(),
      lock: vi.fn(),
    });

    await render(
      <MemoryRouter initialEntries={['/import-preview']}>
        <App />
      </MemoryRouter>,
    );

    await expect.element(page.getByTestId('mock-import-page')).toBeInTheDocument();
  });
});
