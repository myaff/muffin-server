// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      /* ===== TypeScript ===== */
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',

      /* ===== Code style (eslint сам чинит --fix) ===== */
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'space-before-blocks': ['error', 'always'],
      'space-infix-ops': 'error',
      'eol-last': ['error', 'always'],
      'no-trailing-spaces': 'error',
      'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],

      /* ===== Safety & readability ===== */
      'eqeqeq': ['error', 'always'],
      'no-multi-spaces': 'error',
      'no-console': 'warn',
    },
  },
);
