module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-eval': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'no-empty': 'off',
    'no-useless-escape': 'off',
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '*.min.js',
    '*.min.css',
    'webpack.config.js',
    'webpack.prod.js',
  ],
};