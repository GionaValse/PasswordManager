import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import styles from './CheckboxView.module.css';

export interface CheckboxViewProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  id?: string;
}

export const CheckboxView = forwardRef<HTMLInputElement, CheckboxViewProps>(
  (
    { checked, onChange, label, disabled = false, indeterminate = false, id = 'checkbox-view' },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.checked);
    };

    return (
      <label
        id={`${id}-label`}
        data-testid={`test-${id}-label`}
        className={styles.container}
        htmlFor={id}
      >
        <input
          id={id}
          data-testid={`test-${id}`}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          ref={inputRef}
          className={disabled ? styles.disabled : ''}
        />
        <span className={styles.checkmark} aria-hidden="true"></span>
        {label && <span className={styles.label}>{label}</span>}
      </label>
    );
  },
);

CheckboxView.displayName = 'CheckboxView';
