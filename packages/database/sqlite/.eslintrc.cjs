module.exports = {
  root: true,
  extends: ['@undb/eslint-config'],
  parserOptions: {
    project: ['./packages/database/sqlite/tsconfig.json'],
  },
}
