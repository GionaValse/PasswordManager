import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { PasswordRevealerView } from './PasswordRevealerView';

describe('PasswordRevealerView Component', () => {
  it('should render the password hidden by default', async () => {
    await render(<PasswordRevealerView password="mySecretPassword123" />);

    const input = page.getByPlaceholder('password');

    await expect.element(input).toHaveValue('mySecretPassword123');
    await expect.element(input).toHaveAttribute('type', 'password');
  });

  it('should toggle password visibility when clicking the action button', async () => {
    await render(<PasswordRevealerView id="test-revealer" password="secret" />);

    const input = page.getByPlaceholder('password');
    const toggleAction = page.getByTestId('test-test-revealer-toggle');

    await expect.element(input).toHaveAttribute('type', 'password');

    await toggleAction.click();
    await expect.element(input).toHaveAttribute('type', 'text');

    await toggleAction.click();
    await expect.element(input).toHaveAttribute('type', 'password');
  });

  it('should prevent click events from bubbling up to parent elements', async () => {
    const handleParentClick = vi.fn();

    await render(
      <div onClick={handleParentClick} data-testid="parent-row">
        <PasswordRevealerView id="prop-test" password="secret" />
      </div>,
    );

    const toggleAction = page.getByTestId('test-prop-test-toggle');
    await toggleAction.click();

    expect(handleParentClick).not.toHaveBeenCalled();
  });

  it('should render the input as readonly', async () => {
    await render(<PasswordRevealerView password="secret" />);

    const input = page.getByPlaceholder('password');

    await expect.element(input).toHaveAttribute('readonly', '');
  });
});
