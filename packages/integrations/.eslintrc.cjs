module.exports = {
  root: true,
  extends: ['@undb/eslint-config'],
  parserOptions: {
    project: ['./packages/integrations/tsconfig.json'],
  },
}
