import eslintConfigPrettier from '@electron-toolkit/eslint-config-prettier';
import tseslint from '@electron-toolkit/eslint-config-ts';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh';
import { baseConfig, testConfig } from '../eslint.base.config.mjs';

export default [
  { ignores: ['**/node_modules/**', '**/dist/**', '**/out/**'] },
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.web.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...(Array.isArray(tseslint.configs.recommended)
    ? tseslint.configs.recommended
    : [tseslint.configs.recommended]),
  eslintPluginReact.configs.flat.recommended,
  eslintPluginReact.configs.flat['jsx-runtime'],
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': eslintPluginReactHooks,
      'react-refresh': eslintPluginReactRefresh,
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
      ...eslintPluginReactRefresh.configs.vite.rules,
    },
  },
  ...testConfig,
  ...(Array.isArray(eslintConfigPrettier) ? eslintConfigPrettier : [eslintConfigPrettier]),
];
