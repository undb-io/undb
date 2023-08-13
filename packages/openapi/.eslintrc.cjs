module.exports = {
  root: true,
  extends: ['@undb/eslint-config'],
  parserOptions: {
    project: ['./packages/openapi/tsconfig.json'],
  },
}
