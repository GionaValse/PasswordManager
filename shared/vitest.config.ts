import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  optimizeDeps: {
    exclude: ['vitest-browser-react'],
  },
  test: {
    testTimeout: 20000,
    hookTimeout: 20000,
    retry: 3,
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
      exclude: ['src/**/index.ts', 'src/api/**', '**/*.d.ts'],
    },
    projects: [
      {
        test: {
          name: 'unit',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['src/**/*.browser.test.{ts,tsx}'],
          environment: 'jsdom',
        },
      },
      {
        test: {
          name: 'browser',
          include: ['src/**/*.browser.test.{ts,tsx}'],
          browser: {
            enabled: true,
            provider: playwright({
              contextOptions: { colorScheme: 'dark' },
            }),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
