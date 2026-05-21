import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import ConfirmModalDialog from './ConfirmModalDialog';

describe('ConfirmModalDialog Component', () => {
  it('should render with correct titles and buttons', async () => {
    await render(
      <ConfirmModalDialog
        isOpen={true}
        title="Delete Item"
        subtitle="Are you sure?"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    await expect.element(page.getByRole('heading', { name: 'Delete Item' })).toBeVisible();
    await expect.element(page.getByText('Are you sure?')).toBeVisible();

    await expect.element(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect.element(page.getByRole('button', { name: 'Confirm' })).toBeVisible();
  });

  it('should call onClose when Cancel button is clicked', async () => {
    const handleClose = vi.fn();
    await render(
      <ConfirmModalDialog isOpen={true} title="Test" onClose={handleClose} onConfirm={vi.fn()} />,
    );

    const cancelBtn = page.getByRole('button', { name: 'Cancel' });
    await cancelBtn.click();

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onConfirm when Confirm button is clicked', async () => {
    const handleConfirm = vi.fn();
    await render(
      <ConfirmModalDialog isOpen={true} title="Test" onClose={vi.fn()} onConfirm={handleConfirm} />,
    );

    const confirmBtn = page.getByRole('button', { name: 'Confirm' });
    await confirmBtn.click();

    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('should pass the icon to the underlying ModalDialog', async () => {
    await render(
      <ConfirmModalDialog
        isOpen={true}
        title="Test"
        icon={<span data-testid="test-icon">⚠️</span>}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    const icon = page.getByTestId('test-icon');
    await expect.element(icon).toBeVisible();
  });
});
