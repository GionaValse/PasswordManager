import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { ExtraAction, ExtraActionMenu } from './ExtrasComponent';

vi.mock('../tooltip/Tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('ExtrasComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ExtraAction', () => {
    it('should call onExtraClick when clicked', async () => {
      const handleClick = vi.fn();

      await render(
        <ExtraAction id="my-action" onExtraClick={handleClick}>
          <span>Click Me</span>
        </ExtraAction>,
      );

      const actionBtn = page.getByTestId('test-my-action');
      await actionBtn.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('ExtraActionMenu', () => {
    const mockList = [
      { id: 1, text: 'Edit' },
      { id: 2, text: 'Delete' },
    ];

    const triggerId = 'test-extra-action-menu-extra-action';
    const menuId = 'test-extra-action-menu-menu';
    const menuItemEditId = 'test-extra-action-menu-menu-item-1';

    it('should toggle menu visibility when clicking the icon', async () => {
      await render(<ExtraActionMenu extraList={mockList} />);

      const toggleButton = page.getByTestId(triggerId);
      const menuList = page.getByTestId(menuId);

      await expect.element(menuList).not.toBeInTheDocument();

      await toggleButton.click();
      await expect.element(menuList).toBeVisible();

      await toggleButton.click();
      await expect.element(menuList).not.toBeInTheDocument();
    });

    it('should close menu when clicking outside the component', async () => {
      await render(
        <div>
          <div data-testid="outside-area">Outside</div>
          <ExtraActionMenu extraList={mockList} />
        </div>,
      );

      const toggleButton = page.getByTestId(triggerId);
      const outsideArea = page.getByTestId('outside-area');
      const menuList = page.getByTestId(menuId);

      await toggleButton.click();
      await expect.element(menuList).toBeVisible();

      await outsideArea.click();
      await expect.element(menuList).not.toBeInTheDocument();
    });

    it('should call onExtraClick with correct id and close menu', async () => {
      const handleSelect = vi.fn();
      await render(<ExtraActionMenu extraList={mockList} onExtraClick={handleSelect} />);

      const toggleButton = page.getByTestId(triggerId);
      const menuList = page.getByTestId(menuId);

      await toggleButton.click();

      const editItem = page.getByTestId(menuItemEditId);
      await editItem.click();

      expect(handleSelect).toHaveBeenCalledWith(1);
      await expect.element(menuList).not.toBeInTheDocument();
    });
  });
});
