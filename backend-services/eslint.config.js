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
      // all of the TS-recommended rules
      ...tsPlugin.configs.recommended.rules,
      // turn on the Prettier rule so formatting issues show up as lint errors
      'prettier/prettier': 'error',
    },
  },
  // last in the array so it can turn off any formatting rules that conflict
  eslintConfigPrettier,
]);
