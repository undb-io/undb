module.exports = {
  root: true,
  extends: ['@undb/eslint-config'],
  parserOptions: {
    emitDecoratorMetadata: true,
  },
  rules: {
    '@typescript-eslint/consistent-type-imports': 'warn',
  },
}
