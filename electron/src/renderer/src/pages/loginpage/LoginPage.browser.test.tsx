import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import LoginPage from './LoginPage';

import { useVault } from 'shared-password-manager/hooks/vault/VaultHook.js';

vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>();
  return {
    ...actual,
    LockKeyhole: () => <svg data-testid="test-lock-keyhole-icon" />,
  };
});

vi.mock('shared-password-manager/hooks/vault/VaultHook.js', () => ({
  useVault: vi.fn(),
}));

describe('LoginPage', () => {
  let queryClient: QueryClient;
  let mockUnlock: (masterPassword: string) => Promise<void> = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    mockUnlock = vi.fn().mockResolvedValue(undefined);

    vi.mocked(useVault).mockReturnValue({
      isVaultUnlocked: () => false,
      unlock: mockUnlock,
      isVaultCreated: () => true,
      isLoading: false,
      create: vi.fn(),
      lock: vi.fn(),
    });
  });

  const renderLoginPage = async () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  it('redirects away if the vault is already unlocked', async () => {
    vi.mocked(useVault).mockReturnValue({
      isVaultUnlocked: () => true,
      unlock: mockUnlock,
    } as any);

    await renderLoginPage();

    await expect.element(page.getByText('Unlock Local Vault')).not.toBeInTheDocument();
  });

  it('keeps the submit button disabled until the form is perfectly valid', async () => {
    await renderLoginPage();

    const submitBtn = page.getByRole('button', { name: 'Unlock Vault' });

    await expect.element(submitBtn).toBeDisabled();

    const pwdInput = page.getByTestId('test-password-input');

    await pwdInput.fill('weak');
    await expect.element(submitBtn).toBeDisabled();

    await pwdInput.fill('Weak');
    await expect.element(submitBtn).toBeDisabled();

    await pwdInput.fill('longpassword');
    await expect.element(submitBtn).toBeDisabled();

    await pwdInput.fill('StrongPassword123');
    await expect.element(submitBtn).toBeEnabled();
  });

  it('calls unlock with the master password when submitted successfully', async () => {
    await renderLoginPage();

    await page.getByTestId('test-password-input').fill('ValidPass123!');

    const submitBtn = page.getByRole('button', { name: 'Unlock Vault' });
    await submitBtn.click();

    expect(mockUnlock).toHaveBeenCalledOnce();
    expect(mockUnlock).toHaveBeenCalledWith('ValidPass123!');
  });
});
