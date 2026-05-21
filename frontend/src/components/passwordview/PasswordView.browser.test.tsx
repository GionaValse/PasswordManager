import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router';
import { QrCodeService } from 'shared-password-manager/utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { passwordsApi } from '../../apiconfig';
import PasswordView from './PasswordView';

vi.mock('shared-password-manager/utils', () => ({
  QrCodeService: {
    getQrCodeFromPassword: vi.fn((data) => ({ ...data })),
  },
  formatRelativeDate: vi.fn(() => 'some time ago'),
  parseApiError: vi.fn(() => ({ message: 'An error occurred' })),
}));

vi.mock('shared-password-manager/ui/qrcodeview/QrCodeView', async () => {
  return {
    QrCodeView: (props: { url: string }) => <div data-testid="mock-qrcode">{props.url}</div>,
  };
});

vi.mock('shared-password-manager/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('shared-password-manager/hooks')>();
  return {
    ...actual,
    useModal: () => ({
      activeModal: null,
      open: vi.fn(),
      close: vi.fn(),
    }),
  };
});

vi.mock('../../apiconfig', () => ({
  passwordsApi: {
    passwordsControllerFindOne: vi.fn(),
    passwordsControllerUpdateOne: vi.fn(),
    passwordsControllerCreateOne: vi.fn(),
    passwordsControllerUpdateFavorite: vi.fn(),
    passwordsControllerDeleteOne: vi.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

const Wrapper = ({ initialEntries = ['/v1/p1'] }: { initialEntries?: string[] }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/:vaultId/:passwordId" element={<PasswordView />} />
        <Route path="/:vaultId" element={<div>Vault Page</div>} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);

describe('PasswordView Component', () => {
  const mockPassword = {
    id: 'p1',
    service: 'Google',
    username: 'user@test.com',
    website: 'https://google.com',
    password: 'password123',
    favorite: false,
    creationDate: new Date(),
    modifiedDate: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();

    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should display password details in read-only mode by default', async () => {
    vi.mocked(passwordsApi.passwordsControllerFindOne).mockResolvedValue(mockPassword as any);

    await render(<Wrapper />);

    await expect.element(page.getByRole('heading', { name: 'Google' })).toBeVisible();

    const usernameInput = page.getByTestId('test-username-input');
    await expect.element(usernameInput).toHaveAttribute('readonly', '');
  });

  it('should render the QrCodeView with correct JSON data in read-only mode', async () => {
    vi.mocked(passwordsApi.passwordsControllerFindOne).mockResolvedValue(mockPassword as any);

    await render(<Wrapper />);

    const qrCodeElement = page.getByTestId('mock-qrcode');
    await expect.element(qrCodeElement).toBeVisible();

    const expectedJsonStr = JSON.stringify(
      QrCodeService.getQrCodeFromPassword(mockPassword as any),
    );
    await expect.element(qrCodeElement).toHaveTextContent(expectedJsonStr);
  });

  it('should NOT render QrCodeView when in edit mode', async () => {
    vi.mocked(passwordsApi.passwordsControllerFindOne).mockResolvedValue(mockPassword as any);

    await render(<Wrapper />);

    await expect.element(page.getByTestId('mock-qrcode')).toBeVisible();

    const editBtn = page.getByTestId('test-password-edit-action');
    await editBtn.click();

    await expect.element(page.getByTestId('mock-qrcode')).not.toBeInTheDocument();
  });

  it('should enter edit mode and update password', async () => {
    vi.mocked(passwordsApi.passwordsControllerFindOne).mockResolvedValue(mockPassword as any);
    vi.mocked(passwordsApi.passwordsControllerUpdateOne).mockResolvedValue({
      ...mockPassword,
      service: 'Google Updated',
    } as any);

    await render(<Wrapper />);

    await expect.element(page.getByRole('heading', { name: 'Google' })).toBeVisible();

    const editBtn = page.getByTestId('test-password-edit-action');
    await editBtn.click();

    const nameInput = page.getByTestId('test-service-input');
    await nameInput.fill('Google Updated');

    const saveBtn = page.getByRole('button', { name: 'Save' });
    await saveBtn.click();

    await vi.waitFor(() => {
      expect(passwordsApi.passwordsControllerUpdateOne).toHaveBeenCalled();
    });
  });

  it('should toggle favorite status', async () => {
    vi.mocked(passwordsApi.passwordsControllerFindOne).mockResolvedValue(mockPassword as any);
    vi.mocked(passwordsApi.passwordsControllerUpdateFavorite).mockResolvedValue({
      ...mockPassword,
      favorite: true,
    } as any);

    await render(<Wrapper />);

    const favBtn = page.getByTestId('test-password-favorite-action');
    await favBtn.click();

    await vi.waitFor(() => {
      expect(passwordsApi.passwordsControllerUpdateFavorite).toHaveBeenCalled();
    });
  });

  it('should handle new password creation', async () => {
    vi.mocked(passwordsApi.passwordsControllerCreateOne).mockResolvedValue({
      ...mockPassword,
      id: 'new-id',
    } as any);

    await render(<Wrapper initialEntries={['/v1/add-password']} />);

    await page.getByTestId('test-service-input').fill('New Entry');
    await page.getByTestId('test-website-input').fill('https://test.com');
    await page.getByTestId('test-username-input').fill('myuser');
    await page.getByTestId('test-password-input').fill('mypass');

    const addBtn = page.getByRole('button', { name: 'Add' });
    await addBtn.click();

    await vi.waitFor(() => {
      expect(passwordsApi.passwordsControllerCreateOne).toHaveBeenCalled();
    });
  });
});
