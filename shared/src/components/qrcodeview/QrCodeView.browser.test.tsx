import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { QrCodeView } from './QrCodeView';

const { mockToDataURL } = vi.hoisted(() => ({
  mockToDataURL: vi.fn(),
}));

vi.mock('qrcode', () => ({
  default: {
    toDataURL: mockToDataURL,
  },
  toDataURL: mockToDataURL,
}));

describe('QrCodeView Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    vi.clearAllMocks();
  });

  it('should render the loading view initially', async () => {
    let resolveMock: (value: string) => void;
    const controlledPromise = new Promise<string>((resolve) => {
      resolveMock = resolve;
    });

    mockToDataURL.mockReturnValue(controlledPromise);

    await render(
      <QueryClientProvider client={queryClient}>
        <QrCodeView url="https://example.com" />
      </QueryClientProvider>,
    );

    await expect.element(page.getByRole('img', { name: 'QR Code' })).not.toBeInTheDocument();

    resolveMock!('data:image/png;base64,done');
  });

  it('should render the qr code image successfully', async () => {
    const mockDataUrl = 'data:image/png;base64,mocked-qr-code-data';

    mockToDataURL.mockResolvedValue(mockDataUrl);

    await render(
      <QueryClientProvider client={queryClient}>
        <QrCodeView url="https://example.com" />
      </QueryClientProvider>,
    );

    // 4. Usiamo page e toBeVisible
    const imageElement = page.getByRole('img', { name: 'QR Code' });
    await expect.element(imageElement).toBeVisible();
    await expect.element(imageElement).toHaveAttribute('src', mockDataUrl);

    expect(mockToDataURL).toHaveBeenCalledWith('https://example.com', expect.any(Object));
  });

  it('should render an error message if qr code generation fails', async () => {
    const errorMessage = 'Failed to generate QR code';

    mockToDataURL.mockRejectedValue(new Error(errorMessage));

    await render(
      <QueryClientProvider client={queryClient}>
        <QrCodeView url="https://example.com" />
      </QueryClientProvider>,
    );

    await expect.element(page.getByText(errorMessage)).toBeVisible();
    await expect.element(page.getByRole('img', { name: 'QR Code' })).not.toBeInTheDocument();
  });
});
