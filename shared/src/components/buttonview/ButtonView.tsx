import type React from 'react';
import styles from './ButtonView.module.css';

interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'error' | 'errorOutline';
  icon?: React.ReactNode;
  fit?: 'content' | 'flex';
}

export function BaseButton({
  children,
  variant = 'primary',
  icon,
  fit = 'content',
  className,
  ...props
}: BaseButtonProps) {
  const buttonClasses = `${styles.btn} ${styles[variant]} ${styles[fit]} ${className || ''}`;

  return (
    <button className={buttonClasses} {...props}>
      {icon && <span className={styles.btnIcon}>{icon}</span>}
      {children}
    </button>
  );
}

interface ButtonProps extends BaseButtonProps {
  text: string;
  align?: 'left' | 'center' | 'right';
}

export function SubmitButton({ text, align = 'center', ...props }: ButtonProps) {
  return (
    <div className={styles.buttonWrapper} data-align={align}>
      <BaseButton type="submit" variant="primary" {...props}>
        {text}
      </BaseButton>
    </div>
  );
}

export function SecondaryButton({ text, align = 'center', ...props }: ButtonProps) {
  return (
    <div className={styles.buttonWrapper} data-align={align}>
      <BaseButton variant="outline" type="button" {...props}>
        {text}
      </BaseButton>
    </div>
  );
}

export function ErrorButton({ text, align = 'center', ...props }: ButtonProps) {
  return (
    <div className={styles.buttonWrapper} data-align={align}>
      <BaseButton variant="error" type="button" {...props}>
        {text}
      </BaseButton>
    </div>
  );
}
