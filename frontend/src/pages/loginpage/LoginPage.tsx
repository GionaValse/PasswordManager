import { useMutation } from '@tanstack/react-query';
import { LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate } from 'react-router';
import type { UserCreateDto } from 'shared-password-manager/api';
import { useAuth } from 'shared-password-manager/hooks';
import { AuthCardView, InputView, SubmitButton } from 'shared-password-manager/ui';
import { parseApiError } from 'shared-password-manager/utils';
import styles from './LoginPage.module.css';

interface CredentalDataType {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [credentials, setCredentials] = useState<CredentalDataType>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const { isAuthenticated, login } = useAuth();

  const submitMutation = useMutation({
    mutationFn: async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      const userCreate: UserCreateDto = {
        ...credentials,
        username: credentials.email,
      };
      await login(userCreate);
    },
    onSuccess: () => setIsLoading(false),
    onError: async (e: unknown) => {
      const apiError = await parseApiError(e);
      console.error('error while login:', e);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, form } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    validateForm(form);
  };

  return (
    <main className={styles.loginContainer}>
      <AuthCardView
        title="Welcome back"
        subtitle="Enter your credentials to login"
        icon={<LockKeyhole size={32} color="var(--color-primary)" />}
        error={error}
      >
        <form
          className={styles.form}
          onSubmit={submitMutation.mutate}
          onInput={(e: React.InputEvent<HTMLFormElement>) => validateForm(e.currentTarget)}
        >
          <InputView
            id="email"
            label="Email"
            type="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
          <InputView
            id="password"
            label="Password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <div className={styles.actions}>
            <a href="#forgot" className={styles.forgotLink}>
              Forgot your password?
            </a>
          </div>

          <SubmitButton
            text={isLoading ? 'Logging in...' : 'Login'}
            align="center"
            disabled={isLoading || !isFormValid}
          />
        </form>
        <footer className={styles.footer}>
          <span>Don't have an account?</span>
          <Link to={'/registration'} replace className={styles.registerBtn}>
            Register
          </Link>
        </footer>
      </AuthCardView>
    </main>
  );
}
