import 'shared-password-manager/theme';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router';
import App from './App';
import { VaultProvider } from './providers/vault/VaultProvider';

const root = createRoot(document.getElementById('root')!);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

window.api.onPasswordsImported((importedData) => {
  queryClient.setQueryData(['pendingImport'], importedData);
  window.location.hash = '#/import-preview';
});

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <VaultProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </VaultProvider>
    </QueryClientProvider>
  </StrictMode>,
);
