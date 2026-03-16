const js = require('@eslint/js');
const ts = require('typescript-eslint');
const angular = require('@angular-eslint/eslint-plugin');
const angularTemplate = require('@angular-eslint/eslint-plugin-template');
const globals = require('globals');

module.exports = [
  {
    ignores: ['node_modules/', 'dist/', '.angular/', 'coverage/', '**/*.spec.ts'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: ts.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': ts.plugin,
      '@angular-eslint': angular,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: require('@angular-eslint/template-parser'),
    },
    plugins: {
      '@angular-eslint/template': angularTemplate,
    },
    rules: {
      '@angular-eslint/template/no-negated-async': 'error',
    },
  },
];
