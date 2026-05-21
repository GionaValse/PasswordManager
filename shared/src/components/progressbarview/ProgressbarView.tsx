import styles from './ProgressbarView.module.css';

interface ProgressbarViewProps {
  id?: string;
  progress: number;
  max: number;
}

export const ProgressbarView = ({
  id = 'progressbarView',
  progress,
  max,
}: ProgressbarViewProps) => {
  const percentage = (progress / max) * 100;

  return (
    <div id={id} data-testid={`test-${id}`} className={styles.progressbarContainer}>
      <div
        id={`${id}-fill`}
        data-testid={`test-${id}-fill`}
        className={styles.progressbarFill}
        style={{ width: `${percentage}%` }}
      />
      <div
        id={`${id}-track`}
        data-testid={`test-${id}-track`}
        className={styles.progressbarTrack}
        style={{ width: `${100 - percentage}%` }}
      />
    </div>
  );
};
