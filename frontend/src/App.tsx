import './App.css';

import { Route, Routes } from 'react-router';
import { useAuth } from 'shared-password-manager/hooks';
import { ProtectedRoute } from 'shared-password-manager/ui';
import HomePage from './pages/homepage/HomePage';
import LoginPage from './pages/loginpage/LoginPage';
import RegistrationPage from './pages/registrationpage/RegistrationPage';
import SessionPage from './pages/sessionpage/SessionPage';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registration" element={<RegistrationPage />} />
      <Route
        path="/sessions"
        element={
          <ProtectedRoute isAllowed={isAuthenticated()} isLoading={isLoading}>
            <SessionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/:vaultId?/:passwordId?"
        element={
          <ProtectedRoute isAllowed={isAuthenticated()} isLoading={isLoading}>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
}

export default App;
