import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { ProtectedRoute } from './ProtectedRoute';

const mockAuth = {
  isAuthenticated: vi.fn(),
  isLoading: false,
};

vi.mock('shared-password-manager/ui', () => ({
  LoadingView: () => <div data-testid="loading-view">Loading...</div>,
}));

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show LoadingView when auth is loading', async () => {
    mockAuth.isLoading = true;

    const { getByTestId } = await render(
      <MemoryRouter>
        <ProtectedRoute isAllowed={false} isLoading={true}>
          <div>Private Content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    await expect.element(getByTestId('loading-view')).toBeVisible();
  });

  it('should redirect to /login when user is NOT authenticated', async () => {
    mockAuth.isLoading = false;
    mockAuth.isAuthenticated.mockReturnValue(false);

    const { container, getByTestId } = await render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAllowed={false} fallbackPath="/login">
                <div data-testid="private">Private Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    const privateContent = getByTestId('private');
    await expect.element(privateContent).not.toBeInTheDocument();

    await expect.element(container).toHaveTextContent('Login Page');
  });

  it('should redirect to /otherlogin when user is NOT authenticated and login route is overridden', async () => {
    mockAuth.isLoading = false;
    mockAuth.isAuthenticated.mockReturnValue(false);

    const { container, getByTestId } = await render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAllowed={false} fallbackPath="/otherlogin">
                <div data-testid="private">Private Content</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/otherlogin"
            element={<div data-testid="otherlogin-page">Other Login Page</div>}
          />
        </Routes>
      </MemoryRouter>,
    );

    const privateContent = getByTestId('private');
    await expect.element(privateContent).not.toBeInTheDocument();

    await expect.element(container).toHaveTextContent('Other Login Page');
  });

  it('should render children when user IS authenticated', async () => {
    mockAuth.isLoading = false;
    mockAuth.isAuthenticated.mockReturnValue(true);

    const { getByText } = await render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ProtectedRoute isAllowed={true}>
          <div data-testid="private">Welcome to Dashboard</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    await expect.element(getByText('Welcome to Dashboard')).toBeVisible();
  });
});
