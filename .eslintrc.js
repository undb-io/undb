module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `@egodb/eslint-config`
  extends: ["custom"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
