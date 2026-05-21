import { describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { SidebarContext } from '../../context/sidebar/SidebarContext';
import { useSidebar } from './SidebarHook';

describe('useSidebar Custom Hook', () => {
  it('should return context value when used within SidebarContext', async () => {
    const mockContextValue = {
      isExpanded: false,
      close: vi.fn(),
      toggleSidebar: vi.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SidebarContext.Provider value={mockContextValue}>{children}</SidebarContext.Provider>
    );

    const { result } = await renderHook(() => useSidebar(), { wrapper });

    expect(result.current).toBe(mockContextValue);
    expect(result.current.isExpanded).toBe(false);
  });

  it('should return a fallback object when used outside of SidebarContext', async () => {
    const { result } = await renderHook(() => useSidebar());

    expect(result.current.isExpanded).toBe(true);

    expect(typeof result.current.close).toBe('function');
    expect(typeof result.current.toggleSidebar).toBe('function');

    expect(() => result.current.close()).not.toThrow();
    expect(() => result.current.toggleSidebar()).not.toThrow();
  });
});
