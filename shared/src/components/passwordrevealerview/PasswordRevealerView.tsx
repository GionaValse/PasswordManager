import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { ExtraAction } from '../extrascomponent/ExtrasComponent';
import styles from './PasswordRevealerView.module.css';

interface PasswordRevealerViewProps {
  id?: string;
  password: string;
}

export function PasswordRevealerView({
  id = 'password-revealer-view',
  password,
}: PasswordRevealerViewProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleTogglePassword = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.passwordRevealer}>
      <input
        type={showPassword ? 'text' : 'password'}
        value={password}
        placeholder="password"
        readOnly
      />
      <ExtraAction id={`${id}-toggle`} type="small" onExtraClick={handleTogglePassword}>
        {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
      </ExtraAction>
    </div>
  );
}
