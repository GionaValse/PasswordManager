import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import SetupPage from './SetupPage';

import { useVault } from 'shared-password-manager/hooks/vault/VaultHook.js';

vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>();

  return {
    ...actual,
    UserPlusIcon: () => <svg data-testid="test-user-plus-icon" />,
  };
});

vi.mock('shared-password-manager/hooks/vault/VaultHook.js', () => ({
  useVault: vi.fn(),
}));

describe('SetupPage', () => {
  let queryClient: QueryClient;
  let mockCreate: (masterPassword: string) => Promise<void> = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    mockCreate = vi.fn().mockResolvedValue(undefined);

    vi.mocked(useVault).mockReturnValue({
      isVaultCreated: () => false,
      create: mockCreate,

      isVaultUnlocked: () => false,
      isLoading: false,
      unlock: vi.fn(),
      lock: vi.fn(),
    });
  });

  const renderSetupPage = async () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SetupPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  it('redirects away if the vault is already created', async () => {
    vi.mocked(useVault).mockReturnValue({
      isVaultCreated: () => true,
      create: mockCreate,
    } as any);

    await renderSetupPage();

    await expect.element(page.getByText('Setup Local Vault')).not.toBeInTheDocument();
  });

  it('keeps the submit button disabled until the form is perfectly valid', async () => {
    await renderSetupPage();

    const submitBtn = page.getByRole('button', { name: 'Initialize Vault' });

    await expect.element(submitBtn).toBeDisabled();

    const pwdInput = page.getByTestId('test-password-input');
    const confirmPwdInput = page.getByTestId('test-confirmPassword-input');

    await pwdInput.fill('Weak1');
    await confirmPwdInput.fill('Weak1');
    await expect.element(submitBtn).toBeDisabled();

    await pwdInput.fill('StrongPassword123');
    await confirmPwdInput.fill('WrongMatch123');
    await expect.element(submitBtn).toBeDisabled();

    await pwdInput.fill('StrongPassword123');
    await confirmPwdInput.fill('StrongPassword123');
    await expect.element(submitBtn).toBeEnabled();
  });

  it('calls create with the master password when submitted successfully', async () => {
    await renderSetupPage();

    await page.getByTestId('test-password-input').fill('ValidPass123!');
    await page.getByTestId('test-confirmPassword-input').fill('ValidPass123!');

    const submitBtn = page.getByRole('button', { name: 'Initialize Vault' });
    await submitBtn.click();

    expect(mockCreate).toHaveBeenCalledOnce();
    expect(mockCreate).toHaveBeenCalledWith('ValidPass123!');
  });
});
