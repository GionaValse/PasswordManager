import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { vaultsApi } from '../../apiconfig';
import VaultView from './VaultView';

vi.mock('../../apiconfig', () => ({
  vaultsApi: {
    vaultsControllerFindOne: vi.fn(),
    vaultsControllerFindVaultPasswords: vi.fn(),
    vaultsControllerDeleteOne: vi.fn(),
  },
  passwordsApi: {
    passwordsControllerFindAll: vi.fn(),
    passwordsControllerFindFavorites: vi.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

const Wrapper = ({ initialEntries = ['/vault/v1'] }: { initialEntries?: string[] }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/vault/:vaultId" element={<VaultView />} />
        <Route path="/all-passwords" element={<div>All Passwords Page</div>} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);

describe('VaultView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();

    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should show loading view initially', async () => {
    let resolveMock: (value: any) => void;
    const controlledPromise = new Promise((resolve) => {
      resolveMock = resolve;
    });

    (vaultsApi.vaultsControllerFindOne as any).mockReturnValue(controlledPromise);
    (vaultsApi.vaultsControllerFindVaultPasswords as any).mockReturnValue(controlledPromise);

    await render(<Wrapper />);

    const loaderContainer = document.querySelector('[class*="vaultView"]');
    expect(loaderContainer).not.toBeNull();

    resolveMock!({ id: 'v1', name: 'Work', ownerId: 'user1' });
  });

  it('should render vault details and passwords list', async () => {
    const mockVault = { id: 'v1', name: 'Work', description: 'Office passwords', ownerId: 'user1' };
    const mockPasswords = [{ id: 'p1', service: 'Github', username: 'gerry', favorite: false }];

    (vaultsApi.vaultsControllerFindOne as any).mockResolvedValue(mockVault);
    (vaultsApi.vaultsControllerFindVaultPasswords as any).mockResolvedValue(mockPasswords);

    const { getByText } = await render(<Wrapper />);

    await expect.element(getByText('Work')).toBeVisible();
    await expect.element(getByText('Office passwords')).toBeVisible();
    await expect.element(getByText('Github')).toBeVisible();
  });

  it('should filter passwords when searching', async () => {
    const mockPasswords = [
      { id: 'p1', service: 'Github', username: 'gerry' },
      { id: 'p2', service: 'Adobe', username: 'gerry' },
    ];
    (vaultsApi.vaultsControllerFindOne as any).mockResolvedValue({ id: 'v1', name: 'V' });
    (vaultsApi.vaultsControllerFindVaultPasswords as any).mockResolvedValue(mockPasswords);

    const { getByText, getByPlaceholder } = await render(<Wrapper />);

    await expect.element(getByText('Github')).toBeVisible();
    await expect.element(getByText('Adobe')).toBeVisible();

    const searchInput = getByPlaceholder('Search...');
    await searchInput.fill('Gith');

    await expect.element(getByText('Github')).toBeVisible();
    await expect.element(getByText('Adobe')).not.toBeInTheDocument();
  });

  it('should open delete confirmation modal and handle deletion', async () => {
    const mockVault = { id: 'v1', name: 'Work', ownerId: 'user1' };
    (vaultsApi.vaultsControllerFindOne as any).mockResolvedValue(mockVault);
    (vaultsApi.vaultsControllerFindVaultPasswords as any).mockResolvedValue([]);
    (vaultsApi.vaultsControllerDeleteOne as any).mockResolvedValue(mockVault);

    const { getByText, getByTestId, getByRole } = await render(<Wrapper />);

    await expect.element(getByText('Work')).toBeVisible();

    const menuTrigger = getByTestId('test-vault-more-action-extra-action');
    await menuTrigger.click();

    const deleteOption = getByTestId('test-vault-more-action-menu-item-1');
    await deleteOption.click();

    await expect.element(getByText(/Do you really want to delete/i)).toBeVisible();

    const confirmBtn = getByRole('button', { name: /confirm/i });
    await confirmBtn.click();

    expect(vaultsApi.vaultsControllerDeleteOne).toHaveBeenCalledWith({ id: 'v1' });
    await expect.element(getByText('All Passwords Page')).toBeVisible();
  });
});
