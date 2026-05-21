import { render } from 'vitest-browser-react';
import { describe, it, expect, vi } from 'vitest';
import { SubmitButton, SecondaryButton, BaseButton } from './ButtonView';

describe('ButtonView Components', () => {
  it('SubmitButton must have the type "submit" and the right text', async () => {
    const { getByRole } = await render(<SubmitButton text="Submit" />);

    const btn = getByRole('button', { name: /submit/i });
    await expect.element(btn).toBeVisible();
    await expect.element(btn).toHaveAttribute('type', 'submit');
  });

  it('SecondaryButton must have the type "button" and the outline variant', async () => {
    const { getByRole } = await render(<SecondaryButton text="Cancel" />);

    const btn = getByRole('button', { name: /cancel/i });
    await expect.element(btn).toHaveAttribute('type', 'button');
    await expect.element(btn).toHaveClass(/outline/);
  });

  it('handles the error message when present', async () => {
    const handleClick = vi.fn();
    const { getByRole } = await render(<BaseButton onClick={handleClick}>Click me</BaseButton>);

    const btn = getByRole('button', { name: /click me/i });
    await btn.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('must show icon if provided', async () => {
    const { getByTestId } = await render(
      <BaseButton icon={<span data-testid="icon">🔥</span>}>Fire</BaseButton>,
    );

    await expect.element(getByTestId('icon')).toBeVisible();
  });

  it('must be disabled if the prop disabled is true', async () => {
    const { getByRole } = await render(<SubmitButton text="Send" disabled />);

    const btn = getByRole('button', { name: /send/i });
    await expect.element(btn).toBeDisabled();
  });
});
