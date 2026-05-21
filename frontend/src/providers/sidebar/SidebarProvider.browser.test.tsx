import { useSidebar } from 'shared-password-manager/hooks';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { SidebarProvider } from './SidebarProvider';

describe('SidebarProvider Logic', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SidebarProvider>{children}</SidebarProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with isExpanded as false', async () => {
    const { result } = await renderHook(() => useSidebar(), { wrapper });

    expect(result.current.isExpanded).toBe(false);
  });

  it('should toggle the expanded state', async () => {
    const { result } = await renderHook(() => useSidebar(), { wrapper });

    result.current.toggleSidebar();
    await vi.waitFor(() => expect(result.current.isExpanded).toBe(true));

    result.current.toggleSidebar();
    await vi.waitFor(() => expect(result.current.isExpanded).toBe(false));
  });

  it('should set isExpanded to false when calling close', async () => {
    const { result } = await renderHook(() => useSidebar(), { wrapper });

    result.current.toggleSidebar();
    await vi.waitFor(() => expect(result.current.isExpanded).toBe(true));

    result.current.close();
    await vi.waitFor(() => expect(result.current.isExpanded).toBe(false));

    result.current.close();
    await vi.waitFor(() => expect(result.current.isExpanded).toBe(false));
  });
});
