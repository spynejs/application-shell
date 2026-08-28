import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import mochaPlugin from 'eslint-plugin-mocha';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/', 'dist/', 'src/tests/', 'repo-scripts'],
  },
  {
    files: ['**/*.js'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // typical browser + Node + Mocha globals
        ...globals.browser,
        ...globals.node,
        ...globals.mocha,
      },
    },

    // Register both Prettier & Mocha plugins
    plugins: {
      prettier: prettierPlugin,
      mocha: mochaPlugin,
    },

    // Merge ESLint’s recommended rules, Prettier’s recommended rules,
    // and Mocha’s recommended rules
    rules: {
      ...js.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,
      ...mochaPlugin.configs.recommended.rules,
      'prettier/prettier': 'off',

      /**
       * Permissive by design. The rules below report incomplete code as
       * often as incorrect code — an import added before it is wired up, an
       * unused handler parameter, a stubbed method body. Formatting is
       * handled by `npm run format`. Rules that identify genuine defects
       * (no-undef, no-dupe-keys, no-unreachable) remain errors via the
       * recommended set.
       */

      // Handler signatures are set by the framework, so an unused event
      // parameter is expected. Unused locals warn; an underscore prefix
      // opts out.
      'no-unused-vars': [
        'warn',
        {
          args: 'none',
          caughtErrors: 'none',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // Empty lifecycle bodies such as onRendered() {} are valid.
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'no-empty-function': 'off',

      // Console output is common when tracing channel payloads.
      'no-console': 'off',

      // Warn rather than error so an active debug session is not blocked.
      'no-debugger': 'warn',
    },
  },
];
