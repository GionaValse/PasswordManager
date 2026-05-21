import type { ReactNode } from 'react';
import styles from './EmptyView.module.css';

interface EmptyViewProps {
  id?: string;
  title: string;
  subtitle?: string;
  icon: ReactNode;
  isError?: boolean;
}

export function EmptyView({
  id = 'empty-view',
  title,
  subtitle,
  icon,
  isError = false,
}: EmptyViewProps) {
  const containerStyle = [styles.emptyViewContaiener, isError && styles.error].join(' ');

  return (
    <div id={id} data-testid={`test-${id}`} className={containerStyle}>
      <div className={styles.iconContainer}>{icon}</div>
      <div className={styles.textContainer}>
        <p id={`${id}-title`} data-testid={`test-${id}-title`} className={styles.title}>
          {title}
        </p>
        {subtitle && (
          <p id={`${id}-subtitle`} data-testid={`test-${id}-subtitle`} className={styles.subtitle}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
