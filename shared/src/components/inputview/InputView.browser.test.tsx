import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { InputView } from './InputView';

const writeTextSpy = vi.fn().mockResolvedValue(undefined);
vi.stubGlobal('navigator', {
  ...window.navigator,
  clipboard: {
    writeText: writeTextSpy,
  },
});

const StatefulWrapper = (props: any) => {
  const [val, setVal] = useState('');
  return (
    <div>
      <div data-testid="outside-area">Outside</div>
      <InputView {...props} value={val} onChange={(e) => setVal(e.target.value)} />
    </div>
  );
};

describe('InputView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with label and initial value', async () => {
    await render(<InputView id="input-view" label="Username" value="Gerry" />);

    await expect.element(page.getByLabelText('Username')).toBeVisible();

    const input = page.getByTestId('test-input-view-input');
    await expect.element(input).toHaveValue('Gerry');
  });

  it('should toggle password visibility when clicking the eye icon', async () => {
    await render(
      <InputView id="password-input" label="Password" type="password" value="secret123" />,
    );

    const input = page.getByTestId('test-password-input-input');
    const toggleBtn = page.getByTestId('test-password-input-password-toggle');

    await expect.element(input).toHaveAttribute('type', 'password');

    await toggleBtn.click();
    await expect.element(input).toHaveAttribute('type', 'text');

    await toggleBtn.click();
    await expect.element(input).toHaveAttribute('type', 'password');
  });

  it('should call navigator.clipboard when copy button is clicked', async () => {
    const testValue = 'text-to-copy';
    await render(<InputView id="copy-input" value={testValue} enableCopy={true} />);

    const copyBtn = page.getByTestId('test-copy-input-copy');
    await copyBtn.click();

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testValue);
  });

  it('should show HTML5 error message after interaction and blur', async () => {
    await render(<StatefulWrapper id="email-input" label="Email" required />);

    const input = page.getByTestId('test-email-input-input');
    const outsideArea = page.getByTestId('outside-area');

    await input.fill('temp');
    await input.fill('');

    await outsideArea.click();

    const alertElement = page.getByRole('alert');
    await expect.element(alertElement).toBeVisible();
  });

  it('should use custom validation logic', async () => {
    const customMsg = 'Troppo corto!';
    const validate = vi.fn((val: string) => (val.length < 5 ? customMsg : ''));

    await render(
      <StatefulWrapper id="custom-input" label="Custom" customValidation={validate} required />,
    );

    const input = page.getByTestId('test-custom-input-input');
    const outsideArea = page.getByTestId('outside-area');

    await input.fill('abc');
    await outsideArea.click();

    const alertElement = page.getByRole('alert');
    await expect.element(alertElement).toBeVisible();
    await expect.element(alertElement).toHaveTextContent(customMsg);
  });
});
