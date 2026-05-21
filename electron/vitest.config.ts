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
      exclude: ['src/**/*.d.ts', 'src/**/index.ts'],
    },
    projects: [
      {
        test: {
          name: 'main-and-preload',
          include: ['src/main/**/*.test.{ts,tsx}', 'src/preload/**/*.test.{ts,tsx}'],
          environment: 'node',
        },
      },
      {
        test: {
          name: 'renderer',
          include: [
            'src/renderer/src/**/*.test.{ts,tsx}',
            'src/renderer/src/**/*.browser.test.{ts,tsx}',
          ],
          setupFiles: ['./src/renderer/src/test/setup.ts'],
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
