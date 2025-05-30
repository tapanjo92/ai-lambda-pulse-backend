import { defineConfig } from 'eslint/config';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default defineConfig([
  {
    files: ['**/*.ts'],

    languageOptions: {
      parser: tsParser,
      parserOptions: { project: './tsconfig.json' },
    },

    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },

    rules: {
      // TypeScript recommended rules
      ...tsPlugin.configs.recommended.rules,
      // Report formatting issues as ESLint errors
      'prettier/prettier': 'error',
    },
  },
  // Disable any rules that conflict with Prettier’s formatting
  eslintConfigPrettier,
]);
