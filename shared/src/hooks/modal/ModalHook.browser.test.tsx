import { describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { useModal } from './ModalHook';

type TestModalType = 'MODAL_A' | 'MODAL_B';

describe('useModal Custom Hook', () => {
  it('should initialize with activeModal as null', async () => {
    const { result } = await renderHook(() => useModal<TestModalType>());

    expect(result.current.activeModal).toBeNull();
  });

  it('should update activeModal to the passed id when open is called', async () => {
    const { result } = await renderHook(() => useModal<TestModalType>());

    result.current.open('MODAL_A');

    await vi.waitFor(() => {
      expect(result.current.activeModal).toBe('MODAL_A');
    });
  });

  it('should reset activeModal to null when close is called', async () => {
    const { result } = await renderHook(() => useModal<TestModalType>());

    result.current.open('MODAL_B');
    await vi.waitFor(() => {
      expect(result.current.activeModal).toBe('MODAL_B');
    });

    result.current.close();
    await vi.waitFor(() => {
      expect(result.current.activeModal).toBeNull();
    });
  });
});
