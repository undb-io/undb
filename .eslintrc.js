module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `@egodb/eslint-config`
  extends: ['@egodb/eslint-config'],
  settings: {
    next: {
      rootDir: ['apps/frontend/'],
    },
  },
}
