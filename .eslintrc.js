module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],

  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "max-lines": [
      "warn",
      {
        max: 100,
        skipBlankLines: true,
      },
    ],
  },
  overrides: [
    {
      files: ["*.spec.ts", "**/lib/test/**/*.ts"],
      rules: {
        "@typescript-eslint/unbound-method": "off",
      },
    },
  ],
};
