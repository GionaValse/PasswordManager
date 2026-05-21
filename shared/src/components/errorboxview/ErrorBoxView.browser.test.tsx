import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { ErrorBoxView } from './ErrorBoxView';

describe('ErrorBoxView component', () => {
  it('must show the right error message', async () => {
    await render(<ErrorBoxView errorMessage={'Error'} />);

    const errorBox = page.getByText('Error');
    await expect.element(errorBox).toBeVisible();
  });

  it('null text do not render error box', async () => {
    await render(<ErrorBoxView errorMessage={null} />);

    const div = page.getByTestId('test-error-box-view');
    await expect(div).not.toBeInTheDocument();
  });
});
