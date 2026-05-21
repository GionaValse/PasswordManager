import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import PasswordListPage from './PasswordListPage';

vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>();
  return {
    ...actual,
    KeyRound: () => <svg data-testid="test-key-round-icon" />,
  };
});

describe('PasswordListPage', () => {
  let queryClient: QueryClient;

  const mockPasswords = [
    { id: '1', service: 'GitHub', username: 'dev1', password: 'pwd', website: 'github.com' },
    { id: '2', service: 'Google', username: 'user2', password: 'pwd', website: 'google.com' },
    { id: '3', service: 'Amazon', username: 'buyer', password: 'pwd', website: 'amazon.it' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  const renderListPage = async () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <PasswordListPage />
      </QueryClientProvider>,
    );
  };

  it('renders the list of passwords successfully', async () => {
    vi.mocked(window.api.getPasswords).mockResolvedValue(mockPasswords);

    await renderListPage();

    await expect.element(page.getByText('GitHub')).toBeInTheDocument();
    await expect.element(page.getByText('Google')).toBeInTheDocument();
    await expect.element(page.getByText('Amazon')).toBeInTheDocument();
  });

  it('filters the password list based on search input', async () => {
    vi.mocked(window.api.getPasswords).mockResolvedValue(mockPasswords);

    await renderListPage();

    await expect.element(page.getByText('GitHub')).toBeInTheDocument();

    const searchInput = page.getByTestId('test-vault-search-view-input');

    await searchInput.fill('git');

    await expect.element(page.getByText('GitHub')).toBeInTheDocument();
    await expect.element(page.getByText('Google')).not.toBeInTheDocument();
    await expect.element(page.getByText('Amazon')).not.toBeInTheDocument();

    await searchInput.fill('amazon.it');

    await expect.element(page.getByText('Amazon')).toBeInTheDocument();
    await expect.element(page.getByText('GitHub')).not.toBeInTheDocument();
  });

  it('displays an empty state message when there are no passwords', async () => {
    vi.mocked(window.api.getPasswords).mockResolvedValue([]);

    await renderListPage();

    await expect.element(page.getByText('Passwords will be displayed here')).toBeInTheDocument();
  });
});
