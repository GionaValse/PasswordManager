import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useContext } from 'react';
import { OtpContext } from 'shared-password-manager/context';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { OtpProvider } from './OtpProvider';

const mockSocket = {
  on: vi.fn(),
  off: vi.fn(),
};

vi.mock('shared-password-manager/hooks', () => ({
  useSocket: () => ({ socket: mockSocket }),
}));

const MockConsumer = () => {
  const context = useContext(OtpContext);
  return (
    <div>
      <span data-testid="ttl-value">{context?.otpTTL}</span>
      <span data-testid="max-ttl-value">{context?.otpMaxTTL}</span>
    </div>
  );
};

describe('OtpProvider Browser Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.spyOn(queryClient, 'invalidateQueries');
  });

  afterEach(() => {
    queryClient.clear();
  });

  const renderProvider = async () => {
    await render(
      <QueryClientProvider client={queryClient}>
        <OtpProvider>
          <MockConsumer />
        </OtpProvider>
      </QueryClientProvider>,
    );
  };

  const emitSocketEvent = (eventName: string, data: any) => {
    const onCall = mockSocket.on.mock.calls.find((call) => call[0] === eventName);
    const callback = onCall?.[1];
    if (callback) callback(data);
  };

  it('should synchronize at first access (otp_syncronize)', async () => {
    await renderProvider();

    emitSocketEvent('otp_syncronize', { ttl: 12000, maxTtl: 30000 });

    await expect.element(page.getByTestId('max-ttl-value')).toHaveTextContent('30000');
    await expect.element(page.getByTestId('ttl-value')).toHaveTextContent('12000');
  });

  it('should restart from zero when receiving the global pulse (otp_rotated)', async () => {
    await renderProvider();

    emitSocketEvent('otp_rotated', { maxTtl: 30000 });

    await expect.element(page.getByTestId('max-ttl-value')).toHaveTextContent('30000');
    await expect.element(page.getByTestId('ttl-value')).toHaveTextContent('30000');
  });
});
