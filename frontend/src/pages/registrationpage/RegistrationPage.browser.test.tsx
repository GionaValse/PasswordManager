import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import RegistrationPage from './RegistrationPage';

const mockAuth = {
  isAuthenticated: vi.fn(),
  create: vi.fn(),
};

vi.mock('shared-password-manager/hooks/auth/AuthHook', () => ({
  useAuth: () => mockAuth,
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>{children}</MemoryRouter>
  </QueryClientProvider>
);

describe('RegistrationPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.isAuthenticated.mockReturnValue(false);

    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should show validation error for short username', async () => {
    await render(<RegistrationPage />, { wrapper: Wrapper });

    const usernameInput = page.getByLabelText(/username/i);
    const passwordInput = page.getByLabelText(/^password$/i);

    await usernameInput.fill('ab');
    await passwordInput.click();

    const errorMessage = page.getByText(/must have at least 3 characters/i);
    await expect.element(errorMessage).toBeVisible();
  });

  it('should show validation error for weak password', async () => {
    await render(<RegistrationPage />, { wrapper: Wrapper });

    const passwordInput = page.getByLabelText(/^password$/i);
    const confirmPasswordInput = page.getByLabelText(/confirm password/i);

    await passwordInput.fill('short');
    await confirmPasswordInput.click();
    await expect.element(page.getByText(/must have at least 8 characters/i)).toBeVisible();

    await passwordInput.fill('lowercaseonly123');
    await confirmPasswordInput.click();
    await expect.element(page.getByText(/a capital letter is needed/i)).toBeVisible();
  });

  it('should show error if passwords do not match', async () => {
    await render(<RegistrationPage />, { wrapper: Wrapper });

    const passwordInput = page.getByLabelText(/^password$/i);
    const confirmPasswordInput = page.getByLabelText(/confirm password/i);

    await passwordInput.fill('Password123!');
    await confirmPasswordInput.fill('Different123!');
    await passwordInput.click();

    await expect.element(page.getByText(/the passwords do not match/i)).toBeVisible();
  });

  it('should enable submit button only when form is valid', async () => {
    await render(<RegistrationPage />, { wrapper: Wrapper });
    const submitBtn = page.getByRole('button', { name: /sign up/i });

    await expect(submitBtn).toBeDisabled();

    await page.getByLabelText(/username/i).fill('ValidUser');
    await page.getByLabelText(/email address/i).fill('test@test.com');
    await page.getByLabelText(/^password$/i).fill('Password123!');
    await page.getByLabelText(/confirm password/i).fill('Password123!');

    await expect(submitBtn).toBeEnabled();
  });

  it('should call create with correct data on submit', async () => {
    mockAuth.create.mockResolvedValue(undefined);
    await render(<RegistrationPage />, { wrapper: Wrapper });

    await page.getByLabelText(/username/i).fill('Marcy');
    await page.getByLabelText(/email address/i).fill('marcy@test.com');
    await page.getByLabelText(/^password$/i).fill('Password123!');
    await page.getByLabelText(/confirm password/i).fill('Password123!');

    await page.getByRole('button', { name: /sign up/i }).click();

    expect(mockAuth.create).toHaveBeenCalledWith({
      username: 'Marcy',
      email: 'marcy@test.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
  });
});
