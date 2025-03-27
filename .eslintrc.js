module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    'plugin:import/errors',
    'plugin:import/warnings'
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: [".eslintrc.{js,cjs}", "*.js"],
      parserOptions: {
        sourceType: "script"
      }
    }
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json"]
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "class-methods-use-this": 0,
    "comma-dangle": ["error", "never"],
    "linebreak-style": 0,
    "global-require": 0,
    "eslint linebreak-style": [0, "error", "windows"],
    "@typescript-eslint/comma-dangle": 0,
    "no-new": 0,
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "always",
        "ts": "never"
      }
    ],
    "consistent-return": "off",
    "no-await-in-loop": "off",
    "no-plusplus": "off",
    "no-param-reassign": "off",
    "@typescript-eslint/naming-convention": "off",
    "no-restricted-syntax": [
      "error",
      {
        "selector": "ForOfStatement",
        "message": "For...of loops are allowed."
      }
    ]
  }
};
