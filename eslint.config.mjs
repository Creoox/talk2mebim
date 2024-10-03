import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const baseRules = {
  'prettier/prettier': [
    'warn',
    {
      singleQuote: true,
      endOfLine: 'auto',
      printWidth: 100,
    },
  ],

  '@typescript-eslint/no-floating-promises': 'off',
  '@typescript-eslint/require-await': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-unsafe-call': 'off',
  '@typescript-eslint/no-unsafe-member-acces': 'off',
  '@typescript-eslint/no-empty-interface': 'off',
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/no-unsafe-declaration-merging': 'off',
  '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

  semi: ['error', 'always'],
  quotes: ['warn', 'single', { allowTemplateLiterals: true }],
};

export default [
  {
    ignores: [
      '**/node_modules',
      '**/dist',
      '**/build',
      '**/components.d.ts',
      '**/.nuxt',
      '**/.turbo',
      '**/*.min.js',
    ],
  },

  ...compat
    .config({
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
      ],

      plugins: ['@typescript-eslint', 'prettier'],

      env: {
        es6: true,
        browser: true,
        node: true,
      },

      rules: baseRules,
    })
    .map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx'],
    })),

  ...compat
    .config({
      extends: [
        'plugin:vue/vue3-essential',
        '@vue/eslint-config-typescript/recommended',
        '@vue/eslint-config-prettier',
      ],

      plugins: ['@typescript-eslint', 'prettier'],

      env: {
        'vue/setup-compiler-macros': true,
      },

      rules: {
        ...baseRules,
        'vue/multi-word-component-names': 'off',
      },
    })
    .map((config) => ({
      ...config,
      files: ['**/*.vue'],
    })),

  ...compat
    .config({
      extends: ['plugin:astro/recommended'],

      parser: 'astro-eslint-parser',

      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },

      plugins: ['@typescript-eslint', 'prettier'],

      rules: {
        ...baseRules,
        'prettier/prettier': ['warn'],
      },
    })
    .map((config) => ({
      ...config,
      files: ['**/*.astro'],
    })),

  ...compat
    .config({
      plugins: ['prettier'],

      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
      },

      env: {
        es6: true,
      },

      rules: {
        'prettier/prettier': [
          'warn',
          {
            singleQuote: true,
            endOfLine: 'auto',
            printWidth: 100,
          },
        ],

        semi: ['error', 'always'],
        quotes: ['warn', 'single', { allowTemplateLiterals: true }],
      },
    })
    .map((config) => ({
      ...config,
      files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    })),
];
