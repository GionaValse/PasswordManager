import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { vaultsApi } from '../../../apiconfig';
import VaultModalDialog from './VaultModalDialog';

vi.mock('../../../apiconfig', () => ({
  vaultsApi: {
    vaultsControllerCreateOne: vi.fn(),
    vaultsControllerUpdateOne: vi.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

const Wrapper = ({
  children,
  initialEntries = ['/'],
}: {
  children: React.ReactNode;
  initialEntries?: string[];
}) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/" element={children} />
        <Route path="/vault/:vaultId" element={children} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);

describe('VaultModalDialog Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();

    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with default values in edit mode', async () => {
    const defaultValue = { name: 'My Vault', description: 'Secret stuff' };

    await render(
      <VaultModalDialog
        type="edit"
        isOpen={true}
        defaultValue={defaultValue}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
      { wrapper: Wrapper },
    );

    const nameInput = page.getByLabelText('Name');
    const descInput = page.getByLabelText('Description');

    await expect.element(nameInput).toHaveValue('My Vault');
    await expect.element(descInput).toHaveValue('Secret stuff');
  });

  it('should call create API when adding a new vault', async () => {
    const handleSave = vi.fn();
    const mockResponse = { id: 'v1', name: 'New Vault' };
    (vaultsApi.vaultsControllerCreateOne as any).mockResolvedValue(mockResponse);

    await render(
      <VaultModalDialog type="add" isOpen={true} onClose={vi.fn()} onSave={handleSave} />,
      { wrapper: Wrapper },
    );

    await page.getByLabelText('Name').fill('New Vault');

    const createBtn = page.getByRole('button', { name: /create/i });
    await createBtn.click();

    expect(vaultsApi.vaultsControllerCreateOne).toHaveBeenCalledWith({
      vaultCreateDto: { name: 'New Vault', description: '' },
    });

    await vi.waitFor(() => expect(handleSave).toHaveBeenCalledWith(mockResponse));
  });

  it('should call update API with vaultId from params when editing', async () => {
    const mockResponse = { id: 'v123', name: 'Updated Name' };
    (vaultsApi.vaultsControllerUpdateOne as any).mockResolvedValue(mockResponse);

    await render(
      <VaultModalDialog
        type="edit"
        isOpen={true}
        defaultValue={{ name: 'Old', description: '' }}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
      { wrapper: (props) => <Wrapper {...props} initialEntries={['/vault/v123']} /> },
    );

    await page.getByLabelText('Name').fill('Updated Name');

    const saveBtn = page.getByRole('button', { name: /save/i });
    await saveBtn.click();

    expect(vaultsApi.vaultsControllerUpdateOne).toHaveBeenCalledWith({
      id: 'v123',
      vaultUpdateDto: { name: 'Updated Name', description: '' },
    });
  });

  it('should show error message from API failure', async () => {
    const fakeError = {
      response: {
        json: () => Promise.resolve({ message: 'Vault name already exists' }),
      },
    };
    (vaultsApi.vaultsControllerCreateOne as any).mockRejectedValue(fakeError);

    await render(<VaultModalDialog type="add" isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />, {
      wrapper: Wrapper,
    });

    await page.getByLabelText('Name').fill('Conflict');
    const createBtn = page.getByRole('button', { name: /create/i });
    await createBtn.click();

    await expect.element(page.getByText('Vault name already exists')).toBeVisible();
  });
});
