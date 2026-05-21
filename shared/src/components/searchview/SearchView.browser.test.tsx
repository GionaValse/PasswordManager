import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { SearchView } from './SearchView';

describe('SearchView Component', () => {
  it('should call onSearchInput when typing', async () => {
    const handleSearch = vi.fn();
    const { getByRole } = await render(<SearchView onSearchInput={handleSearch} />);

    const input = getByRole('searchbox');

    await input.fill('my password');

    expect(handleSearch).toHaveBeenCalled();
  });

  it('should add "hasValue" class to parent when input is not empty', async () => {
    const { getByRole } = await render(<SearchView onSearchInput={() => {}} />);

    const input = getByRole('searchbox');
    const parent = input.element().parentElement;

    await input.fill('abc');

    expect(parent?.className).toMatch(/hasValue/);

    await input.fill('');
    expect(parent?.className).not.toMatch(/hasValue/);
  });

  it('should clear the input and focus it when clicking the X icon', async () => {
    const handleSearch = vi.fn();
    const { getByRole, getByTestId } = await render(<SearchView onSearchInput={handleSearch} />);

    const input = getByRole('searchbox');
    const inputElement = input.element() as HTMLInputElement;

    await input.fill('delete me');
    expect(inputElement.value).toBe('delete me');

    const clearBtn = getByTestId('test-search-view-icon-clear');
    await clearBtn.click();

    expect(inputElement.value).toBe('');

    expect(handleSearch).toHaveBeenCalled();

    expect(document.activeElement).toBe(inputElement);
  });

  it('should show the placeholder text', async () => {
    const { getByPlaceholder } = await render(
      <SearchView placeholder="Search passwords..." onSearchInput={() => {}} />,
    );

    const input = getByPlaceholder('Search passwords...');
    await expect.element(input).toBeVisible();
  });
});
