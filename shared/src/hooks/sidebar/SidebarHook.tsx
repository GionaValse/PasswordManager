import { useContext } from 'react';
import { SidebarContext } from '../../context/sidebar/SidebarContext';

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    return {
      isExpanded: true,
      close: () => {},
      toggleSidebar: () => {},
    };
  }
  return context;
}
