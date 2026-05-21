import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { vaultsApi } from '../../apiconfig';
import Sidebar from './SidebarView';

vi.mock('../../apiconfig', () => ({
  vaultsApi: {
    vaultsControllerFindAll: vi.fn(),
  },
}));

const { mockSidebarHook, mockModalHook } = vi.hoisted(() => ({
  mockSidebarHook: {
    isExpanded: true,
    close: vi.fn(),
    toggleSidebar: vi.fn(),
  },
  mockModalHook: {
    activeModal: null as string | null,
    open: vi.fn(),
    close: vi.fn(),
  },
}));

vi.mock('shared-password-manager/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('shared-password-manager/hooks')>();
  return {
    ...actual,
    useSidebar: () => mockSidebarHook,
    useModal: () => mockModalHook,
  };
});

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>{children}</MemoryRouter>
  </QueryClientProvider>
);

describe('Sidebar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();

    mockSidebarHook.isExpanded = true;
    mockModalHook.activeModal = null;
  });

  it('should render the main title and static vault links', async () => {
    (vaultsApi.vaultsControllerFindAll as any).mockResolvedValue([]);

    await render(<Sidebar title="My Passwords" />, { wrapper: Wrapper });

    await expect.element(page.getByText('My Passwords')).toBeVisible();
    await expect.element(page.getByText(/all passwords/i)).toBeVisible();
    await expect.element(page.getByText(/favorites/i)).toBeVisible();
  });

  it('should render dynamic vaults fetched from the API', async () => {
    const mockVaults = [
      { id: '1', name: 'Work Vault', color: 'blue' },
      { id: '2', name: 'Personal Vault', color: 'red' },
    ];
    (vaultsApi.vaultsControllerFindAll as any).mockResolvedValue(mockVaults);

    await render(<Sidebar title="App" />, { wrapper: Wrapper });

    await expect.element(page.getByText('Work Vault')).toBeVisible();
    await expect.element(page.getByText('Personal Vault')).toBeVisible();
  });

  it('should open the ADD_MODAL when clicking the plus icon in Vaults header', async () => {
    (vaultsApi.vaultsControllerFindAll as any).mockResolvedValue([]);
    await render(<Sidebar title="App" />, { wrapper: Wrapper });

    const addVaultBtn = page.getByTestId('test-sidebar-add-vault-action');
    await addVaultBtn.click();

    expect(mockModalHook.open).toHaveBeenCalledWith('ADD_MODAL');
  });

  it('should apply extended class when isExpanded is true', async () => {
    mockSidebarHook.isExpanded = true;
    (vaultsApi.vaultsControllerFindAll as any).mockResolvedValue([]);

    await render(<Sidebar title="App" />, { wrapper: Wrapper });

    const sidebarSection = document.querySelector('section');
    await expect.element(sidebarSection as HTMLElement).toHaveClass(/extended/);
  });

  it('should close sidebar when clicking on a vault link', async () => {
    (vaultsApi.vaultsControllerFindAll as any).mockResolvedValue([]);
    await render(<Sidebar title="App" />, { wrapper: Wrapper });

    const allPasswordsLink = page.getByText(/all passwords/i);
    await allPasswordsLink.click();

    expect(mockSidebarHook.close).toHaveBeenCalled();
  });
});
