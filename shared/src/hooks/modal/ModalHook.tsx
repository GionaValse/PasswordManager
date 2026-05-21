import { useCallback, useState } from 'react';

export function useModal<T extends string>() {
  const [activeModal, setActiveModal] = useState<T | null>(null);

  const open = useCallback((modalId: T) => setActiveModal(modalId), []);
  const close = useCallback(() => setActiveModal(null), []);

  return { activeModal, open, close };
}
