import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { LoadingView } from './LoadingView';

describe('LoadingView Component', () => {
  it('should render the SVG loader', async () => {
    await render(<LoadingView />);

    const svgElement = page.getByTestId('loading-svg');

    await expect.element(svgElement).toBeInTheDocument();
    await expect.element(svgElement).toHaveAttribute('viewBox', '0 0 240 240');
  });

  it('should have all four animated rings with correct classes', async () => {
    await render(<LoadingView />);

    const ringA = page.getByTestId('ring-a');
    const ringB = page.getByTestId('ring-b');
    const ringC = page.getByTestId('ring-c');
    const ringD = page.getByTestId('ring-d');

    await expect.element(ringA).toHaveClass(/plRingA/);
    await expect.element(ringB).toHaveClass(/plRingB/);
    await expect.element(ringC).toHaveClass(/plRingC/);
    await expect.element(ringD).toHaveClass(/plRingD/);
  });
});
