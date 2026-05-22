import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMediaQuery } from 'react-responsive';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import HomePage from './HomePage';

vi.mock('react-responsive', () => ({
  useMediaQuery: vi.fn(),
}));

vi.mock('../../components/sidebarview/SidebarView', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar">Sidebar {children}</div>
  ),
}));

vi.mock('../../components/vaultview/VaultView', () => ({
  default: () => <div data-testid="vault">Vault</div>,
}));

vi.mock('../../components/passwordview/PasswordView', () => ({
  default: () => <div data-testid="password">Password</div>,
}));

vi.mock('../../providers/otp/OtpProvider', () => ({
  OtpProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../providers/sidebar/SidebarProvider', () => ({
  SidebarProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('shared-password-manager/ui', () => ({
  AccountView: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="account-view">{children}</div>
  ),
  ExtraAction: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="extra-action">{children}</div>
  ),
  ThemeSwitch: () => <div data-testid="theme-switch">ThemeSwitch</div>,
}));

const queryClient = new QueryClient();

const Wrapper = ({ initialEntries = ['/'] }: { initialEntries?: string[] }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:vaultId" element={<HomePage />} />
        <Route path="/:vaultId/:passwordId" element={<HomePage />} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);

describe('HomePage Layout Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Desktop View', () => {
    const useMediaQueryMock = vi.mocked(useMediaQuery);

    beforeEach(() => {
      useMediaQueryMock.mockReturnValue(false);
    });

    it('should render Sidebar, Vault and Password views simultaneously on desktop', async () => {
      await render(<Wrapper initialEntries={['/v1/p1']} />);

      await expect.element(page.getByTestId('sidebar')).toBeVisible();
      await expect.element(page.getByTestId('vault')).toBeVisible();
      await expect.element(page.getByTestId('password')).toBeVisible();
    });
  });

  describe('Mobile View', () => {
    const useMediaQueryMock = vi.mocked(useMediaQuery);

    beforeEach(() => {
      useMediaQueryMock.mockReturnValue(true);
    });

    it('should show ONLY Sidebar when no IDs are present', async () => {
      await render(<Wrapper initialEntries={['/']} />);

      await expect.element(page.getByTestId('sidebar')).toBeVisible();
      await expect.element(page.getByTestId('vault')).not.toBeInTheDocument();
      await expect.element(page.getByTestId('password')).not.toBeInTheDocument();
    });

    it('should show ONLY VaultView when vaultId is present but no passwordId', async () => {
      await render(<Wrapper initialEntries={['/v1']} />);

      await expect.element(page.getByTestId('vault')).toBeVisible();
      await expect.element(page.getByTestId('sidebar')).not.toBeInTheDocument();
      await expect.element(page.getByTestId('password')).not.toBeInTheDocument();
    });

    it('should show ONLY PasswordView when passwordId is present', async () => {
      await render(<Wrapper initialEntries={['/v1/p1']} />);

      await expect.element(page.getByTestId('password')).toBeVisible();
      await expect.element(page.getByTestId('sidebar')).not.toBeInTheDocument();
      await expect.element(page.getByTestId('vault')).not.toBeInTheDocument();
    });
  });
});
