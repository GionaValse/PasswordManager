import expoConfig from 'eslint-config-expo/flat.js';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';
import { baseConfig, testConfig } from '../eslint.base.config.mjs';

const expoRules = Array.isArray(expoConfig) ? expoConfig : [expoConfig];

export default defineConfig([
  {
    ignores: ['dist/**', '.expo/**', 'android/**', 'ios/**'],
  },
  ...baseConfig,
  ...expoRules,
  {
    languageOptions: {
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
    },
  },
  eslintConfigPrettier,
]);
