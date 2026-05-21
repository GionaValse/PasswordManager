import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { AuthCardView } from './AuthCardView';

describe('AuthCardView Component', () => {
  it('renders title and subtitle correctly', async () => {
    const { getByText } = await render(
      <AuthCardView title="Welcome" subtitle="Insert your credentials" />,
    );

    await expect.element(getByText('Welcome')).toBeVisible();
    await expect.element(getByText('Insert your credentials')).toBeVisible();
  });

  it('show icon if passed', async () => {
    const { getByTestId } = await render(
      <AuthCardView
        title="Test"
        subtitle="Test"
        icon={<span data-testid="custom-icon">🚀</span>}
      />,
    );

    await expect.element(getByTestId('custom-icon')).toBeVisible();
  });

  it('renders children correctly', async () => {
    const { getByRole } = await render(
      <AuthCardView title="Test" subtitle="Test">
        <button>Test button</button>
      </AuthCardView>,
    );

    await expect.element(getByRole('button', { name: /test button/i })).toBeVisible();
  });

  it('handles the error message when present', async () => {
    const errorMessage = 'Wrong credentials';
    const { getByText } = await render(
      <AuthCardView title="Test" subtitle="Test" error={errorMessage} />,
    );

    await expect.element(getByText(errorMessage)).toBeVisible();
  });
});
