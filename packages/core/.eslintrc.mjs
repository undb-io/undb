export default {
  root: true,
  extends: ['@egodb/eslint-config'],
  rules: {
    '@typescript-eslint/switch-exhaustiveness-check': 'warn',
  },
  parserOptions: {
    project: ['./packages/core/tsconfig.json'],
  },
}
