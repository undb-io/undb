module.exports = {
  env: {
    browser: true,
    amd: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier', 'plugin:import/typescript'],
  ignorePatterns: ['node_modules', 'dist'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc'],
  rules: {
    'no-console': 'warn',
    // TODO: remove me
    'no-useless-catch': 'off',
    'tsdoc/syntax': 'warn',
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
}
