module.exports = {
  root: true,
  extends: ['@undb/eslint-config'],
  rules: {
    '@typescript-eslint/switch-exhaustiveness-check': 'warn',
  },
  parserOptions: {
    project: ['./packages/core/tsconfig.json'],
  },
}
