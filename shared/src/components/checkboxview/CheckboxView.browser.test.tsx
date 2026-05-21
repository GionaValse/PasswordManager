import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { CheckboxView } from './CheckboxView';

describe('CheckboxView Component', () => {
  it('should render unchecked by default', async () => {
    const handleChange = vi.fn();
    await render(<CheckboxView checked={false} onChange={handleChange} />);

    const input = page.getByRole('checkbox');
    await expect.element(input).not.toBeChecked();

    const inputElement = input.element() as HTMLInputElement;
    expect(inputElement.indeterminate).toBe(false);
  });

  it('should render checked state', async () => {
    const handleChange = vi.fn();
    await render(<CheckboxView checked={true} onChange={handleChange} />);

    const input = page.getByRole('checkbox');
    await expect.element(input).toBeChecked();
  });

  it('should trigger onChange when clicked', async () => {
    const handleChange = vi.fn();
    await render(<CheckboxView checked={false} onChange={handleChange} />);

    const label = page.getByTestId('test-checkbox-view-label');
    await label.click();

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('should correctly handle indeterminate state', async () => {
    const handleChange = vi.fn();

    await render(<CheckboxView checked={false} onChange={handleChange} indeterminate={true} />);

    const input = page.getByRole('checkbox');

    const inputElement = input.element() as HTMLInputElement;
    expect(inputElement.indeterminate).toBe(true);

    await expect.element(input).not.toBeChecked();
  });

  it('should render the label', async () => {
    const handleChange = vi.fn();
    await render(<CheckboxView checked={false} onChange={handleChange} label="Lorem ipsum" />);

    await expect.element(page.getByText('Lorem ipsum')).toBeVisible();

    await page.getByText('Lorem ipsum').click();
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('should handle disabled state', async () => {
    const handleChange = vi.fn();
    await render(<CheckboxView checked={false} onChange={handleChange} disabled={true} />);

    const input = page.getByRole('checkbox');
    const label = page.getByTestId('test-checkbox-view-label');

    await expect.element(input).toBeDisabled();
    await label.click({ force: true });

    expect(handleChange).not.toHaveBeenCalled();
  });
});
