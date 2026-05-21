import { useMutation } from '@tanstack/react-query';
import { UserPlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate } from 'react-router';
import { ResponseError, type UserCreateDto } from 'shared-password-manager/api';
import { useAuth } from 'shared-password-manager/hooks';
import { AuthCardView, InputView, SubmitButton } from 'shared-password-manager/ui';
import { parseApiError } from 'shared-password-manager/utils';
import styles from '../loginpage/LoginPage.module.css';

interface RegistrationDataType {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegistrationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [registrationData, setRegistrationData] = useState<RegistrationDataType>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { isAuthenticated, create } = useAuth();

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

      const userCreate: UserCreateDto = { ...registrationData };
      await create(userCreate);
    },
    onSuccess: () => setIsLoading(false),
    onError: async (e: unknown) => {
      const apiError = await parseApiError(e);
      console.error('Unable to create user: ', e);

      setError(apiError.message);
      setIsLoading(false);
    },
  });

  if (isAuthenticated()) {
    return <Navigate to={'/'} replace />;
  }

  const validateForm = (formElement: HTMLFormElement | null) => {
    if (formElement) setIsFormValid(formElement.checkValidity());
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, form } = e.target;
    setRegistrationData((prev) => ({ ...prev, [name]: value }));
    validateForm(form);
  };

  const usernameValidation = (value: string) => {
    if (value.length < 3) return 'Must have at least 3 characters!';
    return '';
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
    <main className={styles.loginContainer}>
      <AuthCardView
        title="Create Account"
        subtitle="Join us to start managing your passwords securely"
        icon={<UserPlusIcon size={32} color="var(--color-primary)" />}
        error={error}
      >
        <form
          className={styles.form}
          onSubmit={submitMutation.mutate}
          onInput={(e: React.InputEvent<HTMLFormElement>) => validateForm(e.currentTarget)}
        >
          <InputView
            id="username"
            label="Username"
            type="text"
            value={registrationData.username}
            customValidation={usernameValidation}
            onChange={handleOnChange}
            required
          />
          <InputView
            id="email"
            label="Email Address"
            type="email"
            value={registrationData.email}
            onChange={handleOnChange}
            required
          />
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
          <div className={styles.spacer} />
          <SubmitButton
            text={isLoading ? 'Creating account...' : 'Sign Up'}
            align="center"
            disabled={isLoading || !isFormValid}
          />
        </form>
        <footer className={styles.footer}>
          <span>Already have an account?</span>
          <Link to={'/login'} replace className={styles.registerBtn}>
            Log In
          </Link>
        </footer>
      </AuthCardView>
    </main>
  );
}
