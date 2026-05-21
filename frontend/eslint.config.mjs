import eslintConfigPrettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import { baseConfig, testConfig } from '../eslint.base.config.mjs';

export default defineConfig([
  {
    ignores: ['src/api/**'],
  },
  ...baseConfig,
  {
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...testConfig,
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      'react/display-name': 'off',
      'no-inline-style': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
  eslintConfigPrettier,
]);
