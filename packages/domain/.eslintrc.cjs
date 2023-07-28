module.exports = {
  root: true,
  extends: ['@undb/eslint-config'],
  parserOptions: {
    project: ['./packages/domain/tsconfig.json'],
  },
}
