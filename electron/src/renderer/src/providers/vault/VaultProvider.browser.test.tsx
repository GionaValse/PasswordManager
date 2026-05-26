import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useContext } from 'react';
import { VaultContext } from 'shared-password-manager/context';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { VaultProvider } from './VaultProvider';

function DummyConsumer() {
  const context = useContext(VaultContext);
  if (!context) return <div>Nessun contesto trovato</div>;

  return (
    <div>
      <div data-testid="loading">{context.isLoading ? 'loading' : 'ready'}</div>
      <div data-testid="created">{context.isVaultCreated() ? 'yes' : 'no'}</div>
      <div data-testid="unlocked">{context.isVaultUnlocked() ? 'yes' : 'no'}</div>

      <button data-testid="test-create-button" onClick={() => context.create('new-pass')}>
        Create
      </button>
      <button data-testid="test-unlock-button" onClick={() => context.unlock('my-pass')}>
        Unlock
      </button>
      <button data-testid="test-lock-button" onClick={() => context.lock()}>
        Lock
      </button>
      <button data-testid="test-unlock-biometric-button" onClick={() => context.unlockBiometric()}>
        Unlock Biometric
      </button>
    </div>
  );
}

describe('VaultProvider', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(window.api.checkVault).mockResolvedValue(true);
    if (!window.api.checkBiometricAvailable) window.api.checkBiometricAvailable = vi.fn();
    if (!window.api.checkBiometricConfigured) window.api.checkBiometricConfigured = vi.fn();
    if (!window.api.setupBiometric) window.api.setupBiometric = vi.fn();
    if (!window.api.unlockBiometric) window.api.unlockBiometric = vi.fn();

    vi.mocked(window.api.checkBiometricAvailable).mockResolvedValue(false);
    vi.mocked(window.api.checkBiometricConfigured).mockResolvedValue(false);

    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  const renderWithProvider = async () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <VaultProvider>
          <DummyConsumer />
        </VaultProvider>
      </QueryClientProvider>,
    );
  };

  it('should initialize and check for existing vault on mount', async () => {
    vi.mocked(window.api.checkVault).mockResolvedValue(false);

    await renderWithProvider();

    await expect.element(page.getByTestId('loading')).toHaveTextContent('ready');
    await expect.element(page.getByTestId('created')).toHaveTextContent('no');
    await expect.element(page.getByTestId('unlocked')).toHaveTextContent('no');
    expect(window.api.checkVault).toHaveBeenCalledOnce();
  });

  it('should update state when creating a new vault', async () => {
    await renderWithProvider();

    await page.getByTestId('test-create-button').click();

    expect(window.api.createVault).toHaveBeenCalledWith('new-pass');
    await expect.element(page.getByTestId('created')).toHaveTextContent('yes');
    await expect.element(page.getByTestId('unlocked')).toHaveTextContent('yes');
  });

  it('should update state when unlocking the vault', async () => {
    await renderWithProvider();

    await page.getByTestId('test-unlock-button').click();

    expect(window.api.unlockVault).toHaveBeenCalledWith('my-pass');
    await expect.element(page.getByTestId('unlocked')).toHaveTextContent('yes');
  });

  it('should lock the vault and clear state', async () => {
    await renderWithProvider();

    await page.getByTestId('test-unlock-button').click();
    await expect.element(page.getByTestId('unlocked')).toHaveTextContent('yes');

    await page.getByTestId('test-lock-button').click();

    expect(window.api.lockVault).toHaveBeenCalledOnce();
    await expect.element(page.getByTestId('unlocked')).toHaveTextContent('no');
  });

  it('should automatically lock the vault when receiving the onVaultLocked IPC event', async () => {
    let registeredCallback: (() => void) | undefined;
    vi.mocked(window.api.onVaultLocked).mockImplementation((callback) => {
      registeredCallback = callback;
      return vi.fn();
    });

    await renderWithProvider();

    await page.getByTestId('test-unlock-button').click();
    await expect.element(page.getByTestId('unlocked')).toHaveTextContent('yes');

    queryClient.setQueryData(['passwords'], [{ id: 1, service: 'Test' }]);

    expect(registeredCallback).toBeDefined();
    if (registeredCallback) {
      registeredCallback();
    }

    await expect.element(page.getByTestId('unlocked')).toHaveTextContent('no');
    expect(queryClient.getQueryData(['passwords'])).toBeUndefined();
  });

  it('should auto-setup biometrics after creating a vault if available but not configured', async () => {
    vi.mocked(window.api.checkBiometricAvailable).mockResolvedValue(true);
    vi.mocked(window.api.checkBiometricConfigured).mockResolvedValue(false);

    await renderWithProvider();
    await page.getByTestId('test-create-button').click();

    expect(window.api.setupBiometric).toHaveBeenCalledWith('new-pass');
    expect(window.api.setupBiometric).toHaveBeenCalledOnce();
  });

  it('should auto-setup biometrics after manual unlock if available but not configured', async () => {
    vi.mocked(window.api.checkBiometricAvailable).mockResolvedValue(true);
    vi.mocked(window.api.checkBiometricConfigured).mockResolvedValue(false);

    await renderWithProvider();
    await page.getByTestId('test-unlock-button').click();

    expect(window.api.setupBiometric).toHaveBeenCalledWith('my-pass');
  });

  it('should unlock the vault using biometrics if configured', async () => {
    vi.mocked(window.api.checkBiometricConfigured).mockResolvedValue(true);
    vi.mocked(window.api.unlockBiometric).mockResolvedValue(true);

    await renderWithProvider();
    await page.getByTestId('test-unlock-biometric-button').click();

    expect(window.api.unlockBiometric).toHaveBeenCalledOnce();
    await expect.element(page.getByTestId('unlocked')).toHaveTextContent('yes');
  });

  it('should not call unlockBiometric API if it is not configured', async () => {
    vi.mocked(window.api.checkBiometricConfigured).mockResolvedValue(false);

    await renderWithProvider();
    await page.getByTestId('test-unlock-biometric-button').click();

    expect(window.api.unlockBiometric).not.toHaveBeenCalled();
    await expect.element(page.getByTestId('unlocked')).toHaveTextContent('no');
  });
});
