import ReactDOM from 'react-dom';
import { BaseButton } from '../buttonview/ButtonView';
import styles from './ModalDialog.module.css';

export interface ModalButton {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'ghost' | 'error' | 'errorOutline';
  icon?: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  buttons?: ModalButton[];
}

export function ModalDialog({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  buttons,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div data-testid="modal-overlay" className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <header className={styles.header}>
          {icon && <div className={styles.icon}>{icon}</div>}
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </header>

        <div className={styles.body}>{children}</div>

        {buttons && buttons.length > 0 && (
          <footer className={styles.footer}>
            {buttons.map((btn, idx) => (
              <BaseButton
                key={idx}
                variant={btn.variant || 'primary'}
                fit={'flex'}
                onClick={btn.onClick}
                disabled={btn.disabled}
              >
                {btn.label}
              </BaseButton>
            ))}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}
