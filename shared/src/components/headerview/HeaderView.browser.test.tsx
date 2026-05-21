import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { HeaderView } from './HeaderView';

describe('HeaderView Component', () => {
  it('should render title and subtitle correctly', async () => {
    const { getByText } = await render(
      <HeaderView title="Main Title" subtitle="Secondary Subtitle" />,
    );

    await expect.element(getByText('Main Title')).toBeVisible();
    await expect.element(getByText('Secondary Subtitle')).toBeVisible();
  });

  it('should not render back button if onBack is not provided', async () => {
    await render(<HeaderView title="No Back" />);

    const backBtn = page.getByTestId('test-header-view-back-button');
    await expect.element(backBtn).not.toBeInTheDocument();
  });

  it('should render back button and call onBack when clicked', async () => {
    const handleBack = vi.fn();
    await render(<HeaderView title="With Back" onBack={handleBack} />);

    const backBtn = page.getByTestId('test-header-view-back-button');
    await expect.element(backBtn).toBeVisible();

    await backBtn.click();
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('should apply forced back button class when forceShowBack is true', async () => {
    await render(<HeaderView title="Forced Back" forceShowBack={true} />);

    const header = page.getByTestId('test-header-view');
    await expect.element(header).toHaveClass(/withBackButtonForced/);
  });

  it('should render children inside ExtraContainer', async () => {
    const { getByText } = await render(
      <HeaderView title="Title">
        <button>Action Button</button>
      </HeaderView>,
    );

    await expect.element(getByText('Action Button')).toBeVisible();
  });
});
