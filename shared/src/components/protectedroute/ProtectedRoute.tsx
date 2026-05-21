import { Navigate } from 'react-router';
import { LoadingView } from 'shared-password-manager/ui';

interface ProtectedRouteProps {
  isAllowed: boolean;
  isLoading?: boolean;
  fallbackPath?: string;
  children: React.ReactNode;
}

export function ProtectedRoute({
  isAllowed,
  isLoading = false,
  fallbackPath = '/login',
  children,
}: ProtectedRouteProps) {
  if (isLoading) {
    return <LoadingView />;
  }

  if (!isAllowed) {
    return <Navigate to={fallbackPath} replace />;
  }
  return children;
}
