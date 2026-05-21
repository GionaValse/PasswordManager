import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import type { UserCreateDto } from 'shared-password-manager/api';
import { AuthContext } from 'shared-password-manager/context';
import { useSocket } from 'shared-password-manager/hooks';
import { authApi, usersApi } from '../../apiconfig';

interface AuthProviderProps {
  children?: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { socket, connect, disconnect } = useSocket();
  const queryClient = useQueryClient();
  const [userToken, setUserToken] = useState<string | null>(() => localStorage.getItem('token'));

  const { data: user, isLoading } = useQuery({
    queryKey: ['user-account', userToken],
    queryFn: async () => {
      if (!userToken) {
        console.log('User id null');
        return;
      }

      try {
        console.log('Log in....');
        const me = await usersApi.usersControllerFindMe();
        connect(userToken);
        return me;
      } catch (e: unknown) {
        console.error('Error finding user', (e as Error).message);

        localStorage.removeItem('token');
        setUserToken(null);
        disconnect();

        throw e;
      }
    },
    enabled: !!userToken,
    retry: false,
  });

  const saveToken = useCallback(
    (token: string) => {
      localStorage.setItem('token', token);
      setUserToken(token);

      queryClient.invalidateQueries({ queryKey: ['user-account'] });
    },
    [queryClient],
  );

  const create = useCallback(
    async (userDto: UserCreateDto) => {
      const { accessToken } = await authApi.authControllerRegister({ userCreateDto: userDto });
      saveToken(accessToken);
    },
    [saveToken],
  );

  const login = useCallback(
    async (userDto: UserCreateDto) => {
      const { accessToken } = await authApi.authControllerSignIn({ userCreateDto: userDto });
      saveToken(accessToken);
    },
    [saveToken],
  );

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUserToken(null);

    queryClient.removeQueries({ queryKey: ['user-account'] });
    queryClient.clear();

    disconnect();
  }, [queryClient, disconnect]);

  const isAuthenticated = () => user != null;

  useEffect(() => {
    if (!socket) return;

    const handleForceLogout = ({ message }: { message: string }) => {
      console.log(message);
      logout();
    };

    socket.on('force_logout', handleForceLogout);

    return () => {
      socket.off('force_logout', handleForceLogout);
    };
  }, [logout, socket]);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isAuthenticated,
        isLoading,
        create,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
