import { useCallback, useState, type Dispatch, type SetStateAction } from 'react';
import { ListCheckableContext } from '../../context';
import { useListCheckable } from '../../hooks/listcheckable/ListCheckableHook';
import { useSidebar } from '../../hooks/sidebar/SidebarHook';
import { CheckboxView } from '../checkboxview/CheckboxView';
import { ExtraContainer } from '../extrascomponent/ExtrasComponent';
import styles from './ListView.module.css';

interface ListViewProps {
  children: React.ReactNode;
}

interface CheckableListViewProps extends ListViewProps {
  allItemIds: string[];
  checkedItemsId: string[];
  setCheckedItemsId: Dispatch<SetStateAction<string[]>>;
  defaultShowCheckbox?: boolean;
}

interface ListItemViewProps {
  id?: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  isSelected?: boolean;
  onItemClick?: () => void;
  extras?: React.ReactNode[];
}

export function ListView({ children }: ListViewProps) {
  return <div className={styles.listView}>{children}</div>;
}

export function CheckableListView({
  allItemIds,
  checkedItemsId = [],
  setCheckedItemsId,
  defaultShowCheckbox = false,
  children,
}: CheckableListViewProps) {
  const [showCheckbox, setShowCheckbox] = useState(defaultShowCheckbox);

  const setItemChecked = useCallback(
    (id: string, checked: boolean) => {
      if (checked) {
        setCheckedItemsId((prev) => [...prev, id]);
      } else {
        setCheckedItemsId((prev) => prev.filter((item) => item !== id));
      }
    },
    [setCheckedItemsId],
  );

  const toggleAll = useCallback(() => {
    if (checkedItemsId.length === allItemIds.length) {
      setCheckedItemsId([]);
    } else {
      setCheckedItemsId(allItemIds);
    }
  }, [checkedItemsId, allItemIds, setCheckedItemsId]);

  return (
    <ListCheckableContext.Provider
      value={{ showCheckbox, checkedItemsId, setShowCheckbox, setItemChecked, toggleAll }}
    >
      <div className={styles.listViewHeader}>
        <CheckboxView
          id="toggle-all"
          label="Select all"
          checked={checkedItemsId.length === allItemIds.length}
          indeterminate={checkedItemsId.length > 0 && checkedItemsId.length < allItemIds.length}
          onChange={toggleAll}
        />
        <span>
          Selected: {checkedItemsId.length}/{allItemIds.length}
        </span>
      </div>
      <ListView>{children}</ListView>
    </ListCheckableContext.Provider>
  );
}

export function ListItemView({
  id = 'list-item-view',
  title,
  subtitle,
  icon,
  isSelected = false,
  onItemClick,
  extras = [],
}: ListItemViewProps) {
  const { isExpanded } = useSidebar();
  const { showCheckbox, checkedItemsId, setItemChecked } = useListCheckable();

  const handleRowClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('label')) return;

      if (showCheckbox) {
        setItemChecked(id, !checkedItemsId.includes(id));
      } else if (onItemClick) {
        onItemClick();
      }
    },
    [showCheckbox, checkedItemsId, setItemChecked, onItemClick, id],
  );

  const handleCheckboxChange = useCallback(
    (checked: boolean) => {
      setItemChecked(id, checked);
    },
    [setItemChecked, id],
  );

  return (
    <div
      id={id}
      data-testid={`test-${id}`}
      className={
        styles.listItemView +
        (isSelected ? ` ${styles.selected}` : '') +
        (subtitle ? ` ${styles.withSubtitle}` : '') +
        (isExpanded ? '' : ` ${styles.collapsed}`)
      }
      onClick={handleRowClick}
    >
      {showCheckbox && (
        <CheckboxView
          id={`${id}-checkbox`}
          checked={checkedItemsId.includes(id)}
          onChange={handleCheckboxChange}
        />
      )}
      {icon && <div className={styles.listItemIcon}>{icon}</div>}
      <div className={styles.listItemInfo}>
        <h3 className={styles.listItemTitle}>{title}</h3>
        {subtitle && <p className={styles.listItemSubtitle}>{subtitle}</p>}
      </div>
      {extras?.length > 0 && <ExtraContainer>{extras.map((item) => item)}</ExtraContainer>}
    </div>
  );
}
