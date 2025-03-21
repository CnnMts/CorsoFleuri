// eslint.config.cjs

const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const importPlugin = require("eslint-plugin-import");

module.exports = [
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
      // Note : dans le format flat, on ne doit pas utiliser la clé "env" comme dans les anciens fichiers.
      // On simule ici l'environnement via les globals si nécessaire.
      globals: {
        window: "readonly",
        document: "readonly",
      },
    },
    ignores: ["**/node_modules/**", "**/dist/**"],
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
    plugins: {
      "@typescript-eslint": tsPlugin,
      "import": importPlugin,
    },
  },
  {
    // Overriding configuration pour certains fichiers de configuration hérités (optionnel)
    files: [".eslintrc.{js,cjs}", "*.js"],
    languageOptions: {
      parserOptions: { sourceType: "script" },
      globals: { module: "writable", require: "writable" },
    },
  },
];
