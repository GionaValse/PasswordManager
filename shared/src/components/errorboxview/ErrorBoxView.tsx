import styles from './ErrorBoxView.module.css';

interface ErrorBoxViewProps {
  errorMessage?: string | null;
}

export function ErrorBoxView({ errorMessage }: ErrorBoxViewProps) {
  if (!errorMessage) return null;

  return (
    <div data-testid="test-error-box-view" className={styles.errorMessage}>
      {errorMessage}
    </div>
  );
}
