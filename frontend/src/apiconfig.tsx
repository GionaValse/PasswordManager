import {
  AuthApi,
  Configuration,
  PasswordsApi,
  UsersApi,
  VaultsApi,
} from 'shared-password-manager/api';

const apiConfig = new Configuration({
  basePath: import.meta.env.VITE_API_URL,
  accessToken: () => localStorage.getItem('token') || '',
});

export const authApi = new AuthApi(apiConfig);
export const passwordsApi = new PasswordsApi(apiConfig);
export const usersApi = new UsersApi(apiConfig);
export const vaultsApi = new VaultsApi(apiConfig);
