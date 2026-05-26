import { useMutation } from '@tanstack/react-query';
import { LockKeyhole } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { useVault } from 'shared-password-manager/hooks/vault/VaultHook.js';
import { AuthCardView, InputView, SubmitButton } from 'shared-password-manager/ui';
import { parseApiError } from 'shared-password-manager/utils';

interface UnlockDataType {
  password: string;
}

export default function LoginPage(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [unlockData, setUnlockData] = useState<UnlockDataType>({
    password: '',
  });

  const { unlock, isVaultUnlocked, unlockBiometric } = useVault();

  useEffect(() => {
    const tryAutoBiometricUnlock = async () => {
      try {
        await unlockBiometric();
        console.log('Biometric login successful');
      } catch (e: unknown) {
        console.error('Biometric login failed', e);
        setError('Biometric login failed');
      }
    };

    tryAutoBiometricUnlock();
  }, [unlockBiometric]);

  const submitMutation = useMutation({
    mutationFn: async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setIsLoading(true);

      const masterPassword = unlockData.password;
      await unlock(masterPassword);
    },
    onSuccess: () => setIsLoading(false),
    onError: async (e: unknown) => {
      const apiError = await parseApiError(e);
      console.error('Unable to initialize vault: ', e);

      setError(apiError.message);
      setIsLoading(false);
    },
  });

  if (isVaultUnlocked()) {
    return <Navigate to="/" />;
  }

  const validateForm = (formElement: HTMLFormElement | null) => {
    if (formElement) setIsFormValid(formElement.checkValidity());
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, form } = e.target;
    setUnlockData((prev) => ({ ...prev, [name]: value }));
    validateForm(form);
  };

  const passwordsValidation = (value: string): string => {
    if (value.length < 8) return 'Must have at least 8 characters!';
    if (!/[A-Z]/.test(value)) return 'A capital letter is needed!';
    return '';
  };

  return (
    <main className="container centredContainer">
      <AuthCardView
        title="Unlock Local Vault"
        subtitle="Enter your master password to decrypt and access your local vault."
        icon={<LockKeyhole size={32} color="var(--color-primary)" />}
        error={error}
      >
        <form
          onSubmit={submitMutation.mutate}
          onInput={(e: React.InputEvent<HTMLFormElement>) => validateForm(e.currentTarget)}
        >
          <InputView
            id="password"
            label="Password"
            type="password"
            value={unlockData.password}
            customValidation={passwordsValidation}
            onChange={handleOnChange}
            required
          />
          <div className="spacer" />
          <SubmitButton
            text={isLoading ? 'Decrypting...' : 'Unlock Vault'}
            align="center"
            disabled={isLoading || !isFormValid}
          />
        </form>
      </AuthCardView>
    </main>
  );
}
