import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router';
import { ResponseError } from 'shared-password-manager/api';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import LoginPage from './LoginPage';

const mockAuth = {
  isAuthenticated: vi.fn(),
  login: vi.fn(),
};

vi.mock('shared-password-manager/hooks/auth/AuthHook', () => ({
  useAuth: () => mockAuth,
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={children} />
        <Route path="/" element={<div data-testid="dashboard">Dashboard Home</div>} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);

describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
    mockAuth.isAuthenticated.mockReturnValue(false);

    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the login form correctly', async () => {
    await render(<LoginPage />, { wrapper: Wrapper });

    await expect.element(page.getByText('Welcome back')).toBeVisible();
    await expect.element(page.getByLabelText(/email/i)).toBeVisible();
    await expect.element(page.getByLabelText(/password/i)).toBeVisible();
  });

  it('should have the login button disabled by default (invalid form)', async () => {
    await render(<LoginPage />, { wrapper: Wrapper });

    const submitBtn = page.getByRole('button', { name: /login/i });
    await expect.element(submitBtn).toBeDisabled();
  });

  it('should enable the button and call login when form is valid and submitted', async () => {
    mockAuth.login.mockResolvedValue({ success: true });

    await render(<LoginPage />, { wrapper: Wrapper });

    const emailInput = page.getByLabelText(/email/i);
    const passwordInput = page.getByLabelText(/password/i);
    const submitBtn = page.getByRole('button', { name: /login/i });

    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');

    await expect.element(submitBtn).toBeEnabled();
    await submitBtn.click();

    expect(mockAuth.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      username: 'test@example.com',
    });
  });

  it('should show an error message when login fails', async () => {
    const fakeResponse = {
      status: 401,
      json: () => Promise.resolve({ error: 'Invalid credentials' }),
    } as unknown as Response;

    const fakeApiError = new ResponseError(fakeResponse, 'Errore API');

    mockAuth.login.mockRejectedValue(fakeApiError);

    await render(<LoginPage />, { wrapper: Wrapper });

    await page.getByLabelText(/email/i).fill('wrong@test.com');
    await page.getByLabelText(/password/i).fill('wrongpass');

    await page.getByRole('button', { name: /login/i }).click();

    await expect.element(page.getByText('Invalid credentials')).toBeVisible();
  });

  it('should redirect to home if already authenticated', async () => {
    mockAuth.isAuthenticated.mockReturnValue(true);
    await render(<LoginPage />, { wrapper: Wrapper });
    await expect.element(page.getByTestId('dashboard')).toBeVisible();
  });
});
