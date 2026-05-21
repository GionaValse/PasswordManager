import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import App from './App';

const mockAuth = {
  isAuthenticated: vi.fn(),
  login: vi.fn(),
};

vi.mock('shared-password-manager/hooks/auth/AuthHook', () => ({
  useAuth: () => mockAuth,
}));

vi.mock('shared-password-manager/ui', () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="protected-route">{children}</div>
  ),
}));

vi.mock('./pages/homepage/HomePage', () => ({
  default: () => <div data-testid="home-page">Home Page</div>,
}));
vi.mock('./pages/loginpage/LoginPage', () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));
vi.mock('./pages/registrationpage/RegistrationPage', () => ({
  default: () => <div data-testid="registration-page">Registration Page</div>,
}));
vi.mock('./pages/sessionpage/SessionPage', () => ({
  default: () => <div data-testid="session-page">Session Page</div>,
}));

describe('App Routing Logic', () => {
  const renderWithRouter = async (initialPath: string) => {
    await render(
      <MemoryRouter initialEntries={[initialPath]}>
        <App />
      </MemoryRouter>,
    );
  };

  it('should render LoginPage at /login', async () => {
    await renderWithRouter('/login');

    await expect.element(page.getByTestId('login-page')).toBeVisible();
    await expect.element(page.getByTestId('protected-route')).not.toBeInTheDocument();
  });

  it('should render RegistrationPage at /registration', async () => {
    await renderWithRouter('/registration');

    await expect.element(page.getByTestId('registration-page')).toBeVisible();
    await expect.element(page.getByTestId('protected-route')).not.toBeInTheDocument();
  });

  it('should render SessionPage inside ProtectedRoute at /sessions', async () => {
    await renderWithRouter('/sessions');

    await expect.element(page.getByTestId('protected-route')).toBeVisible();
    await expect.element(page.getByTestId('session-page')).toBeVisible();
  });

  it('should render HomePage inside ProtectedRoute at the root (/)', async () => {
    await renderWithRouter('/');

    await expect.element(page.getByTestId('protected-route')).toBeVisible();
    await expect.element(page.getByTestId('home-page')).toBeVisible();
  });

  it('should render HomePage inside ProtectedRoute for dynamic paths (/:vaultId/:passwordId)', async () => {
    await renderWithRouter('/vault-123/pass-456');

    await expect.element(page.getByTestId('protected-route')).toBeVisible();
    await expect.element(page.getByTestId('home-page')).toBeVisible();
  });

  it('should render 404 fallback for unknown paths', async () => {
    await renderWithRouter('/an/unknown/path/that/doesnt/exist');

    await expect.element(page.getByText('Page not found')).toBeVisible();
  });
});
