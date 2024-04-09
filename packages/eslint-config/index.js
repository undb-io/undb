module.exports = {
  env: {
    amd: true,
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:import/typescript',
    'plugin:perfectionist/recommended-natural',
  ],
  ignorePatterns: ['node_modules', 'dist'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc', 'perfectionist'],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-console': 'warn',
    // TODO: remove me
    'no-useless-catch': 'off',
    'perfectionist/sort-objects': [
      'error',
      {
        order: 'asc',
        type: 'natural',
      },
    ],
    'tsdoc/syntax': 'warn',
  },
}
