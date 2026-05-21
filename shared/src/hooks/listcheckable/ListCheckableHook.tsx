import { useContext } from 'react';
import { ListCheckableContext } from '../../context';

export function useListCheckable() {
  const context = useContext(ListCheckableContext);
  if (!context) {
    return {
      showCheckbox: false,
      checkedItemsId: [],
      setShowCheckbox: () => {},
      setItemChecked: () => {},
      toggleAll: () => {},
    };
  }
  return context;
}
