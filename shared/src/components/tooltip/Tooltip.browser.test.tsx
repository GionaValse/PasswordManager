import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Tooltip } from './Tooltip';

vi.mock('react-responsive', () => ({
  useMediaQuery: vi.fn().mockReturnValue(false),
}));

describe('Tooltip Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children correctly', async () => {
    await render(
      <Tooltip text="Helpful info">
        <button>Hover me</button>
      </Tooltip>,
    );

    await expect.element(page.getByText('Hover me')).toBeVisible();
  });

  it('should not render tooltip structure if text is empty', async () => {
    await render(
      <Tooltip text="">
        <button>No tooltip</button>
      </Tooltip>,
    );

    const tooltipText = page.getByTestId('test-tooltip-tip');
    await expect(tooltipText).not.toBeInTheDocument();
  });

  it('should show the tooltip after hover with delay', async () => {
    await render(
      <Tooltip text="Tooltip visible" position="top">
        <div id="trigger">Target</div>
      </Tooltip>,
    );

    const target = page.getByText('Target');
    const tooltipText = page.getByTestId('test-tooltip-tip');

    await expect.element(tooltipText).not.toBeVisible();

    await target.hover();

    await expect.element(tooltipText).toBeVisible();
    await expect.element(tooltipText).toHaveTextContent('Tooltip visible');
  });

  it('should apply the correct position class', async () => {
    await render(
      <Tooltip text="Right info" position="right">
        <span>Content</span>
      </Tooltip>,
    );

    const tooltipText = page.getByTestId('test-tooltip-tip');
    await expect.element(tooltipText).toHaveClass(/right/);
  });

  it('should NOT render tooltip on mobile devices', async () => {
    const { useMediaQuery } = await import('react-responsive');
    (useMediaQuery as any).mockReturnValue(true);

    await render(
      <Tooltip text="Mobile test">
        <span>Content</span>
      </Tooltip>,
    );

    const containerDiv = page.getByTestId('test-tooltip');
    await expect(containerDiv).not.toBeInTheDocument();

    (useMediaQuery as any).mockReturnValue(false);
  });
});
