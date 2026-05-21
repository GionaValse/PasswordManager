import { Check, Copy, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { ExtraAction, ExtraContainer } from '../extrascomponent/ExtrasComponent';
import styles from './InputView.module.css';

interface InputViewProps {
  id: string;
  label?: string;
  value?: string;
  defValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  readOnly?: boolean;
  type?: 'text' | 'password' | 'url' | 'email';
  enableCopy?: boolean;
  customValidation?: (value: string) => string;
}

export function InputView({
  id,
  label = '',
  value = '',
  onChange,
  required = false,
  readOnly = false,
  type = 'text',
  enableCopy = false,
  customValidation,
}: InputViewProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const handleInvalid = (e: React.InvalidEvent<HTMLInputElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    setError(target.validationMessage);
  };

  const handleBlur = () => {
    setIsTouched(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;

    if (customValidation) {
      const errorMessage = customValidation(target.value);
      target.setCustomValidity(errorMessage);
    }

    setError(target.validationMessage);
    if (onChange) onChange(e);
  };

  const handleCopy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shouldShowError = isTouched && error;

  return (
    <div
      id={id}
      data-testid={`test-${id}`}
      className={styles.inputView + (shouldShowError ? ` ${styles.hasError}` : '')}
    >
      <input
        className={`${type === 'password' ? styles.hasIcon : ''} ${shouldShowError ? styles.inputError : ''}`}
        id={`${id}-input`}
        data-testid={`test-${id}-input`}
        name={id}
        type={inputType}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onInvalid={handleInvalid}
        required={required}
        readOnly={readOnly}
        placeholder=" "
      />
      <label htmlFor={`${id}-input`} className={styles.inputViewLabel}>
        {label}
      </label>
      <div className={styles.inputActions}>
        <ExtraContainer>
          {type === 'password' && (
            <ExtraAction
              id={`${id}-password-toggle`}
              type="small"
              onExtraClick={() => setShowPassword((p) => !p)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </ExtraAction>
          )}
          {enableCopy && value && (
            <ExtraAction id={`${id}-copy`} type="small" onExtraClick={handleCopy}>
              {copied ? <Check className={styles.iconCheck} size={18} /> : <Copy size={18} />}
            </ExtraAction>
          )}
        </ExtraContainer>
      </div>
      <div className={styles.inputViewUnderline}></div>
      {shouldShowError && (
        <span id={`${id}-error`} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
