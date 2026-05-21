import { ArrowBigLeftIcon } from 'lucide-react';
import { ExtraContainer } from '../extrascomponent/ExtrasComponent';
import styles from './HeaderView.module.css';

interface HeaderViewProps {
  id?: string;
  title: string;
  subtitle?: string;
  forceShowBack?: boolean;
  onBack?: () => void;
  children?: React.ReactNode;
}

export function HeaderView({
  id = 'header-view',
  title,
  subtitle,
  forceShowBack = false,
  onBack,
  children,
}: HeaderViewProps) {
  const headerStyle = [
    styles.headerView,
    onBack && styles.withBackButton,
    forceShowBack && styles.withBackButtonForced,
  ].join(' ');

  return (
    <header id={id} data-testid={`test-${id}`} className={headerStyle}>
      {onBack && (
        <div
          id={`${id}-back-button`}
          className={styles.backButton}
          data-testid={`test-${id}-back-button`}
          onClick={onBack}
        >
          <ArrowBigLeftIcon size={18} />
        </div>
      )}
      <div className={styles.headerContent}>
        <h2 className={styles.headerTitle}>{title}</h2>
        {subtitle && <p className={styles.headerSubtitle}>{subtitle}</p>}
      </div>
      <ExtraContainer>{children}</ExtraContainer>
    </header>
  );
}
