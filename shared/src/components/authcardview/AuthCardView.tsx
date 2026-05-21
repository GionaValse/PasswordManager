import { ErrorBoxView } from 'shared-password-manager/ui';
import styles from './AuthCardView.module.css';

interface AuthCardViewProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  error?: string | null;
  children?: React.ReactNode;
}

export function AuthCardView({ title, subtitle, icon, error, children }: AuthCardViewProps) {
  return (
    <div className={styles.authCard}>
      <header className={styles.header}>
        <div className={styles.logoBadge}>{icon && icon}</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>
      <ErrorBoxView errorMessage={error} />
      {children && children}
    </div>
  );
}
