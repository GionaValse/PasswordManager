import 'shared-password-manager/theme';
import './index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.tsx';
import { AuthProvider } from './providers/auth/AuthProvider.tsx';
import { SocketProvider } from './providers/socket/SocketProvider.tsx';

const root = createRoot(document.getElementById('root')!);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

root.render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </SocketProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
