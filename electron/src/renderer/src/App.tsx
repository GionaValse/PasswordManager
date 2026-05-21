import { Route, Routes } from 'react-router';
import { useVault } from 'shared-password-manager/hooks/vault/VaultHook.js';
import { ProtectedRoute } from 'shared-password-manager/ui';
import ImportPreviewPage from './pages/importpreviewpage/ImportPreviewPage';
import LoginPage from './pages/loginpage/LoginPage';
import PasswordListPage from './pages/passwordlistpage/PasswordListPage';
import SetupPage from './pages/setuppage/SetupPage';

function App(): React.JSX.Element {
  const { isVaultCreated, isVaultUnlocked, isLoading } = useVault();
  const lockedRoute = !isVaultCreated() ? '/setup' : '/login';

  return (
    <Routes>
      <Route path="/setup" element={<SetupPage />} />
      <Route
        path="/login"
        element={
          <ProtectedRoute isAllowed={isVaultCreated()} isLoading={isLoading} fallbackPath="/setup">
            <LoginPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute
            isAllowed={isVaultCreated() && isVaultUnlocked()}
            isLoading={isLoading}
            fallbackPath={lockedRoute}
          >
            <PasswordListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/import-preview"
        element={
          <ProtectedRoute
            isAllowed={isVaultCreated() && isVaultUnlocked()}
            isLoading={isLoading}
            fallbackPath={lockedRoute}
          >
            <ImportPreviewPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
