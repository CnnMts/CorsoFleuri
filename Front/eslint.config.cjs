const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const importPlugin = require("eslint-plugin-import");

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  globals: {
    window: "readonly",
    document: "readonly",
  },
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "class-methods-use-this": "off",
    "comma-dangle": ["error", "never"],
    "linebreak-style": "off",
    "global-require": "off",
    "@typescript-eslint/comma-dangle": "off",
    "no-new": "off",
    "import/extensions": ["error", "ignorePackages", { js: "always", ts: "never" }],
    "consistent-return": "off",
    "no-await-in-loop": "off",
    "no-plusplus": "off",
    "no-param-reassign": "off",
    "@typescript-eslint/naming-convention": "off",
  },
  overrides: [
    {
      files: [".eslintrc.{js,cjs}", "*.js"],
      parserOptions: { sourceType: "script" },
      globals: { module: "writable", require: "writable" },
    },
  ],
};