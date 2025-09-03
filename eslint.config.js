
const js = require('@eslint/js');
const globals = require('globals');
const pluginPrettier = require('eslint-plugin-prettier');
const configPrettier = require('eslint-config-prettier');

module.exports = [
  
  { ignores: ['dist/**', 'node_modules/**', 'eslint.config.js'] },

  
  js.configs.recommended,
  configPrettier,


  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script', 
      globals: {
        ...globals.browser,
        bootstrap: 'readonly',
        $: 'readonly',
        jQuery: 'readonly',
      },
    },
    plugins: { prettier: pluginPrettier },
    rules: {
      'prettier/prettier': [
        'error',
        { singleQuote: true, printWidth: 100, semi: true, trailingComma: 'es5' },
      ],
      'no-var': 'error',
      'prefer-const': 'warn',
      eqeqeq: ['error', 'smart'],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];
