import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { CheckableListView, ListItemView, ListView } from './ListView';

const mockSidebar = {
  isExpanded: true,
};

vi.mock('../../hooks/sidebar/SidebarHook', () => ({
  useSidebar: () => mockSidebar,
}));

describe('ListView and ListItemView Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSidebar.isExpanded = true;
  });

  it('should render the list with multiple items', async () => {
    await render(
      <ListView>
        <ListItemView title="Item 1" />
        <ListItemView title="Item 2" />
      </ListView>,
    );

    await expect.element(page.getByText('Item 1')).toBeVisible();
    await expect.element(page.getByText('Item 2')).toBeVisible();
  });

  it('should call onItemClick when an item is clicked', async () => {
    const handleClick = vi.fn();
    await render(<ListItemView title="Clickable Item" onItemClick={handleClick} />);

    const item = page.getByText('Clickable Item');
    await item.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should apply the selected class when isSelected is true', async () => {
    await render(<ListItemView title="Selected Item" isSelected={true} />);

    const item = page.getByTestId('test-list-item-view');
    await expect.element(item).toHaveClass(/selected/);
  });

  it('should show the subtitle when provided', async () => {
    await render(<ListItemView title="Title" subtitle="Description" />);

    await expect.element(page.getByText('Description')).toBeVisible();
    const item = page.getByTestId('test-list-item-view');
    await expect.element(item).toHaveClass(/withSubtitle/);
  });

  it('should apply the collapsed class when sidebar is not expanded', async () => {
    mockSidebar.isExpanded = false;

    await render(<ListItemView title="Collapsed Item" />);

    const item = page.getByTestId('test-list-item-view');
    await expect.element(item).toHaveClass(/collapsed/);
  });

  it('should render the icon if provided', async () => {
    await render(
      <ListItemView title="Icon Item" icon={<span data-testid="custom-icon">⭐</span>} />,
    );

    await expect.element(page.getByTestId('custom-icon')).toBeVisible();
  });

  it('should render extras when provided', async () => {
    await render(
      <ListItemView
        title="Item with Extras"
        extras={[
          <button key="btn-1" data-testid="extra-button">
            Action
          </button>,
          <span key="badge-1">New</span>,
        ]}
      />,
    );

    await expect.element(page.getByTestId('extra-button')).toBeVisible();
    await expect.element(page.getByText('New')).toBeVisible();
  });
});

describe('CheckableListView (Controlled Component) and Header Interaction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const ControlledListWrapper = ({
    allIds = ['item-1', 'item-2'],
    initialChecked = [] as string[],
    showCheckbox = true,
  }) => {
    const [checked, setChecked] = useState<string[]>(initialChecked);
    return (
      <CheckableListView
        allItemIds={allIds}
        checkedItemsId={checked}
        setCheckedItemsId={setChecked}
        defaultShowCheckbox={showCheckbox}
      >
        <ListItemView id="item-1" title="Item 1" />
        <ListItemView id="item-2" title="Item 2" />
      </CheckableListView>
    );
  };

  it('should not show item checkboxes by default', async () => {
    await render(<ControlledListWrapper showCheckbox={false} />);

    await expect.element(page.getByTestId('test-item-1-checkbox')).not.toBeInTheDocument();
    await expect.element(page.getByText('Select all')).toBeVisible();
  });

  it('should show header with correct initial count', async () => {
    await render(<ControlledListWrapper initialChecked={['item-2']} />);

    await expect.element(page.getByText('Selected: 1/2')).toBeVisible();
  });

  it('should toggle all items from the header checkbox', async () => {
    await render(<ControlledListWrapper />);

    await expect.element(page.getByText('Selected: 0/2')).toBeVisible();

    const selectAllLabel = page.getByTestId('test-toggle-all-label');
    await selectAllLabel.click();
    await expect.element(page.getByText('Selected: 2/2')).toBeVisible();

    await selectAllLabel.click();
    await expect.element(page.getByText('Selected: 0/2')).toBeVisible();
  });

  it('should update header count when individual items are toggled', async () => {
    await render(<ControlledListWrapper />);

    const label1 = page.getByTestId('test-item-1-checkbox-label');
    const label2 = page.getByTestId('test-item-2-checkbox-label');

    await label1.click();
    await expect.element(page.getByText('Selected: 1/2')).toBeVisible();

    await label2.click();
    await expect.element(page.getByText('Selected: 2/2')).toBeVisible();

    await label1.click();
    await expect.element(page.getByText('Selected: 1/2')).toBeVisible();
  });

  it('should pass correct values to setCheckedItemsId prop from parent', async () => {
    const mockSetChecked = vi.fn();

    await render(
      <CheckableListView
        allItemIds={['item-1', 'item-2']}
        checkedItemsId={['item-1']}
        setCheckedItemsId={mockSetChecked}
        defaultShowCheckbox={true}
      >
        <ListItemView id="item-1" title="Item 1" />
      </CheckableListView>,
    );

    const label1 = page.getByTestId('test-item-1-checkbox-label');
    await label1.click();

    expect(mockSetChecked).toHaveBeenCalled();
  });
});
