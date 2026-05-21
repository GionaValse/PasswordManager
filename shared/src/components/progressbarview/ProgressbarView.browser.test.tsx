import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { ProgressbarView } from './ProgressbarView';

describe('ProgressbarView', () => {
  it('calculate and display the correct width at 50%', async () => {
    await render(<ProgressbarView progress={50} max={100} />);

    const fill = page.getByTestId('test-progressbarView-fill');
    const track = page.getByTestId('test-progressbarView-track');

    expect(fill).toHaveStyle({ width: '50%' });
    expect(track).toHaveStyle({ width: '50%' });
  });

  it('calculate percentages correctly with a different max value', async () => {
    await render(<ProgressbarView progress={3} max={10} />);

    const fill = page.getByTestId('test-progressbarView-fill');
    const track = page.getByTestId('test-progressbarView-track');

    expect(fill).toHaveStyle({ width: '30%' });
    expect(track).toHaveStyle({ width: '70%' });
  });

  it('calculate and display the correct width at 0%', async () => {
    await render(<ProgressbarView progress={0} max={50} />);

    const fill = page.getByTestId('test-progressbarView-fill');
    const track = page.getByTestId('test-progressbarView-track');

    expect(fill).toHaveStyle({ width: '0%' });
    expect(track).toHaveStyle({ width: '100%' });
  });

  it('calculate and display the correct width at 100%', async () => {
    await render(<ProgressbarView progress={150} max={150} />);

    const fill = page.getByTestId('test-progressbarView-fill');
    const track = page.getByTestId('test-progressbarView-track');

    expect(fill).toHaveStyle({ width: '100%' });
    expect(track).toHaveStyle({ width: '0%' });
  });

  it('calculate and display the correct width for decimal values', async () => {
    await render(<ProgressbarView progress={1} max={3} />);

    const fill = page.getByTestId('test-progressbarView-fill');

    const expectedPercentage = (1 / 3) * 100;
    expect(fill).toHaveStyle({ width: `${expectedPercentage}%` });
  });
});
