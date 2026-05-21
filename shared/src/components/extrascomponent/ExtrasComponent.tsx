import { EllipsisVerticalIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Tooltip, type TooltipPositionType } from '../tooltip/Tooltip';
import styles from './ExtrasComponent.module.css';

interface ExtraContainerProps {
  children: React.ReactNode;
}

interface ExtraActionProps {
  id?: string;
  noHover?: boolean;
  error?: boolean;
  type?: 'normal' | 'small';
  tooltipText?: string;
  tooltipPosition?: TooltipPositionType;
  onExtraClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
}

interface ExtraActionMenuType {
  id: number;
  text: string;
}

interface ExtraActionMenuProps {
  id?: string;
  extraList: ExtraActionMenuType[];
  tooltipText?: string;
  tooltipPosition?: TooltipPositionType;
  onExtraClick?: (id: number) => void;
}

export function ExtraContainer({ children }: ExtraContainerProps) {
  return <div className={styles.extrasContainer}>{children}</div>;
}

export function ExtraAction({
  id = 'extra-action',
  noHover = false,
  error = false,
  type = 'normal',
  tooltipText = '',
  tooltipPosition = 'top',
  onExtraClick,
  children,
}: ExtraActionProps) {
  const classNames = [
    styles.extraAction,
    noHover && styles.noHover,
    error && styles.error,
    type === 'small' && styles.small,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tooltip text={tooltipText} position={tooltipPosition}>
      <div
        id={id}
        data-testid={`test-${id}`}
        className={classNames}
        role="button"
        onClick={onExtraClick}
      >
        {children}
      </div>
    </Tooltip>
  );
}

export function ExtraActionMenu({
  id = 'extra-action-menu',
  extraList,
  tooltipText = '',
  tooltipPosition = 'top',
  onExtraClick,
}: ExtraActionMenuProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleItemClick = (id: number) => {
    setIsOpen(false);

    if (onExtraClick) onExtraClick(id);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div id={id} data-testid={`test-${id}`} ref={menuRef} className={styles.extraActionMenu}>
      <ExtraAction
        id={`${id}-extra-action`}
        tooltipText={tooltipText}
        tooltipPosition={tooltipPosition}
        onExtraClick={toggleMenu}
      >
        <EllipsisVerticalIcon size={18} />
      </ExtraAction>
      {isOpen && (
        <ul id={`${id}-menu`} data-testid={`test-${id}-menu`} className={styles.menuList}>
          {extraList.map((item) => (
            <li
              key={item.id}
              id={`${id}-menu-item-${item.id}`}
              data-testid={`test-${id}-menu-item-${item.id}`}
              className={styles.menuListItem}
              onClick={() => handleItemClick(item.id)}
            >
              {item.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
