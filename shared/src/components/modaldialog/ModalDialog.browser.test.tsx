import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { ModalDialog } from './ModalDialog';

describe('ModalDialog Component', () => {
  it('should not render anything when isOpen is false', async () => {
    await render(<ModalDialog isOpen={false} onClose={vi.fn()} title="Closed Modal" />);

    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render in document.body when isOpen is true', async () => {
    await render(
      <ModalDialog isOpen={true} onClose={vi.fn()} title="Open Modal" subtitle="Modal Subtitle">
        <p>Modal Content</p>
      </ModalDialog>,
    );

    await expect.element(page.getByRole('heading', { name: 'Open Modal' })).toBeVisible();
    await expect.element(page.getByText('Modal Subtitle')).toBeVisible();
    await expect.element(page.getByText('Modal Content')).toBeVisible();
  });

  it('should call onClose when clicking the overlay', async () => {
    const handleClose = vi.fn();
    await render(<ModalDialog isOpen={true} onClose={handleClose} title="Close Test" />);

    const overlay = page.getByTestId('modal-overlay');
    await overlay.click({ position: { x: 5, y: 5 } });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when clicking inside the modal (stopPropagation)', async () => {
    const handleClose = vi.fn();
    await render(<ModalDialog isOpen={true} onClose={handleClose} title="Stop Propagation Test" />);

    const modal = page.getByRole('dialog');
    await modal.click();

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('should render buttons and trigger their actions', async () => {
    const handleConfirm = vi.fn();
    const buttons = [{ label: 'Confirm', onClick: handleConfirm }];

    await render(
      <ModalDialog isOpen={true} onClose={vi.fn()} title="Buttons Test" buttons={buttons} />,
    );

    const confirmBtn = page.getByRole('button', { name: 'Confirm' });
    await expect.element(confirmBtn).toBeVisible();

    await confirmBtn.click();
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });
});
