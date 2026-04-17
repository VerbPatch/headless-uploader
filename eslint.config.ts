import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';
import { Linter } from 'eslint';

const config: Linter.Config[] = [
  js.configs.recommended,
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/.changeset/**',
      'examples/uploader-server/**',
      '**/.angular/**',
      '**/.svelte-kit/**',
      '**/*.cjs',
      '**/*.mjs',
      'scripts/**',
      '**/*.md',
      '**/*.mdx',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        jQuery: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-case-declarations': 'warn',
      'no-useless-escape': 'warn',
      'no-undef': 'off',
      '@typescript-eslint/no-this-alias': 'off',
    },
  },
];

export default config;
