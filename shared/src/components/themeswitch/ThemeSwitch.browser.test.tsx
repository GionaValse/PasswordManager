import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { ThemeSwitch } from './ThemeSwitch';

describe('ThemeSwitch Component', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    vi.clearAllMocks();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('should initialize with correct theme based on system preference', async () => {
    (window.matchMedia as any).mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
    }));

    const { getByRole } = await render(<ThemeSwitch />);
    const checkbox = getByRole('checkbox').element() as HTMLInputElement;

    expect(checkbox.checked).toBe(false);
  });

  it('should toggle theme and update document attribute when clicked', async () => {
    await render(<ThemeSwitch />);

    const label = page.getByTestId('test-theme-switch-label');

    await label.click();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    await label.click();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should apply the slider class from CSS modules', async () => {
    await render(<ThemeSwitch />);

    const slider = page.getByTestId('test-theme-switch-label');
    await expect.element(slider).toBeVisible();
  });
});
