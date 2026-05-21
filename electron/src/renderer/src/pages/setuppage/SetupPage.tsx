import { useMutation } from '@tanstack/react-query';
import { UserPlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Navigate } from 'react-router';
import { ResponseError } from 'shared-password-manager/api';
import { useVault } from 'shared-password-manager/hooks/vault/VaultHook.js';
import { AuthCardView, InputView, SubmitButton } from 'shared-password-manager/ui';
import { parseApiError } from 'shared-password-manager/utils';

interface RegistrationDataType {
  password: string;
  confirmPassword: string;
}

export default function SetupPage(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [registrationData, setRegistrationData] = useState<RegistrationDataType>({
    password: '',
    confirmPassword: '',
  });

  const { create, isVaultCreated } = useVault();

  const submitMutation = useMutation({
    mutationFn: async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setIsLoading(true);

      if (registrationData.password !== registrationData.confirmPassword) {
        throw new ResponseError(
          new Response(JSON.stringify({ message: 'Passwords do not match' }), { status: 400 }),
        );
      }

      await create(registrationData.password);
    },
    onSuccess: () => setIsLoading(false),
    onError: async (e: unknown) => {
      const apiError = await parseApiError(e);
      console.error('Unable to initialize vault: ', e);

      setError(apiError.message);
      setIsLoading(false);
    },
  });

  if (isVaultCreated()) {
    return <Navigate to="/" />;
  }

  const validateForm = (formElement: HTMLFormElement | null) => {
    if (formElement) setIsFormValid(formElement.checkValidity());
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, form } = e.target;
    setRegistrationData((prev) => ({ ...prev, [name]: value }));
    validateForm(form);
  };

  const passwordsValidation = (value: string): string => {
    if (value.length < 8) return 'Must have at least 8 characters!';
    if (!/[A-Z]/.test(value)) return 'A capital letter is needed!';
    return '';
  };

  const confirmPasswordValidation = (value: string): string => {
    if (!registrationData.password) return '';
    if (value !== registrationData.password) return 'The passwords do not match';
    return '';
  };

  return (
    <main className="container centredContainer">
      <AuthCardView
        title="Setup Local Vault"
        subtitle="Set a secure master password to encrypt and protect your local vault."
        icon={<UserPlusIcon size={32} color="var(--color-primary)" />}
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
            value={registrationData.password}
            customValidation={passwordsValidation}
            onChange={handleOnChange}
            required
          />
          <InputView
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={registrationData.confirmPassword}
            customValidation={confirmPasswordValidation}
            onChange={handleOnChange}
            required
          />
          <div className="spacer" />
          <SubmitButton
            text={isLoading ? 'Encrypting...' : 'Initialize Vault'}
            align="center"
            disabled={isLoading || !isFormValid}
          />
        </form>
      </AuthCardView>
    </main>
  );
}
