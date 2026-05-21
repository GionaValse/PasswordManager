import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { ListCheckableContext } from '../../context';
import { useListCheckable } from './ListCheckableHook';

describe('useListCheckable Custom Hook', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return default fallback values when used OUTSIDE of ListCheckableContext', async () => {
    const { result } = await renderHook(() => useListCheckable());

    expect(result.current.showCheckbox).toBe(false);
    expect(result.current.checkedItemsId).toEqual([]);

    expect(() => result.current.setShowCheckbox(true)).not.toThrow();
    expect(() => result.current.setItemChecked('id-1', true)).not.toThrow();
  });

  it('should return actual context values when used WITHIN ListCheckableContext', async () => {
    const mockContextValue = {
      showCheckbox: true,
      checkedItemsId: ['item-1', 'item-2'],
      setShowCheckbox: vi.fn(),
      setItemChecked: vi.fn(),
      toggleAll: vi.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ListCheckableContext.Provider value={mockContextValue}>
        {children}
      </ListCheckableContext.Provider>
    );

    const { result } = await renderHook(() => useListCheckable(), { wrapper });

    expect(result.current.showCheckbox).toBe(true);
    expect(result.current.checkedItemsId).toEqual(['item-1', 'item-2']);

    result.current.setShowCheckbox(false);
    expect(mockContextValue.setShowCheckbox).toHaveBeenCalledWith(false);

    result.current.setItemChecked('item-3', true);
    expect(mockContextValue.setItemChecked).toHaveBeenCalledWith('item-3', true);
  });
});
