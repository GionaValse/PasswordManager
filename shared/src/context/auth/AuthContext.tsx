import { createContext } from 'react';
import type { UserCreateDto, UserResponseDto } from '../../api';

interface AuthContextType {
  user: UserResponseDto | null;
  isAuthenticated: () => boolean;
  isLoading: boolean;
  create: (userData: UserCreateDto) => Promise<void>;
  login: (userData: UserCreateDto) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
