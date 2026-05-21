import React from 'react';
import { useMediaQuery } from 'react-responsive';
import styles from './Tooltip.module.css';

export type TooltipPositionType =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight';

interface TooltipProps {
  id?: string;
  text: string;
  position?: TooltipPositionType;
  children: React.ReactNode;
}

export function Tooltip({ id = 'tooltip', text, position = 'top', children }: TooltipProps) {
  const isMobile = useMediaQuery({ query: '(hover: none) and (pointer: coarse)' });

  if (isMobile || !text) return <>{children}</>;

  return (
    <div id={id} data-testid={`test-${id}`} className={styles.tooltipContainer} data-tooltip={text}>
      {children}
      <span
        id={`${id}-tip`}
        data-testid={`test-${id}-tip`}
        className={`${styles.tooltipText} ${styles[position]}`}
      >
        {text}
      </span>
    </div>
  );
}
