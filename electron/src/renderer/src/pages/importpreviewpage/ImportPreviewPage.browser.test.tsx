import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import ImportPreviewPage from './ImportPreviewPage';

vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>();
  return {
    ...actual,
    KeyRound: () => <svg data-testid="test-key-round-icon" />,
  };
});

describe('ImportPreviewPage', () => {
  let queryClient: QueryClient;

  const mockPendingData = [
    { id: '1', service: 'GitHub', username: 'dev1', password: 'pwd' },
    { id: '2', service: 'Google', username: 'dev2', password: 'pwd' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, queryFn: () => null } },
    });

    queryClient.setQueryData(['pendingImport'], mockPendingData);
  });

  const renderImportPage = async () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ImportPreviewPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  it('renders the list of pending passwords', async () => {
    await renderImportPage();

    await expect.element(page.getByText('GitHub')).toBeInTheDocument();
    await expect.element(page.getByText('Google')).toBeInTheDocument();
  });

  it('cancels the import, clears cache and navigates away', async () => {
    await renderImportPage();

    await page.getByRole('button', { name: /cancel/i }).click();

    const data = queryClient.getQueryData(['pendingImport']);
    expect(data).toBeNullable();
  });

  it('imports ONLY the checked items and clears cache', async () => {
    await renderImportPage();

    const checkboxGoogleLabel = page.getByTestId('test-pending-item-2-checkbox-label');
    await checkboxGoogleLabel.click();

    await page.getByRole('button', { name: /import/i }).click();

    expect(window.api.savePasswords).toHaveBeenCalledOnce();

    const calledWithArgs = vi.mocked(window.api.savePasswords).mock.calls[0][0];

    expect(calledWithArgs).toHaveLength(1);
    expect(calledWithArgs[0]).toEqual(
      expect.objectContaining({ service: 'GitHub', username: 'dev1' }),
    );

    const data = queryClient.getQueryData(['pendingImport']);
    expect(data).toBeNullable();
  });
});
