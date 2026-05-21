import styles from './LoadingView.module.css';

export function LoadingView() {
  return (
    <div className={styles.loadingView}>
      <svg
        data-testid="loading-svg"
        className={styles.pl}
        width={240}
        height={240}
        viewBox="0 0 240 240"
      >
        <circle
          data-testid="ring-a"
          className={`${styles.plRing} ${styles.plRingA}`}
          cx={120}
          cy={120}
          r={105}
          fill="none"
          stroke="#000"
          strokeWidth={20}
          strokeDasharray="0 660"
          strokeDashoffset={-330}
          strokeLinecap="round"
        />
        <circle
          data-testid="ring-b"
          className={`${styles.plRing} ${styles.plRingB}`}
          cx={120}
          cy={120}
          r={35}
          fill="none"
          stroke="#000"
          strokeWidth={20}
          strokeDasharray="0 220"
          strokeDashoffset={-110}
          strokeLinecap="round"
        />
        <circle
          data-testid="ring-c"
          className={`${styles.plRing} ${styles.plRingC}`}
          cx={85}
          cy={120}
          r={70}
          fill="none"
          stroke="#000"
          strokeWidth={20}
          strokeDasharray="0 440"
          strokeLinecap="round"
        />
        <circle
          data-testid="ring-d"
          className={`${styles.plRing} ${styles.plRingD}`}
          cx={155}
          cy={120}
          r={70}
          fill="none"
          stroke="#000"
          strokeWidth={20}
          strokeDasharray="0 440"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
