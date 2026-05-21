import { createContext } from 'react';

interface SidebarContextType {
  isExpanded: boolean;
  close: () => void;
  toggleSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);
