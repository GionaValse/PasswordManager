import { createContext } from 'react';

interface ListCheckableContextType {
  showCheckbox: boolean;
  checkedItemsId: string[];
  setShowCheckbox: (val: boolean) => void;
  setItemChecked: (id: string, checked: boolean) => void;
  toggleAll: (allIds: string[]) => void;
}

export const ListCheckableContext = createContext<ListCheckableContextType | undefined>(undefined);
