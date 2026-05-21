import { useState } from 'react';
import { SidebarContext } from 'shared-password-manager/context';

interface SidebarProviderProps {
  children: React.ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => setIsExpanded((prev) => !prev);

  const close = () => setIsExpanded(false);

  return (
    <SidebarContext.Provider value={{ isExpanded, close, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}
