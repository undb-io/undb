module.exports = {
  "env": {
    "browser": true,
    "amd": true,
    "node": true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', "prettier"],
  ignorePatterns: ['node_modules', 'dist'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    "react/jsx-key": "off",
    "@typescript-eslint/consistent-type-imports": "warn",
  },
};
