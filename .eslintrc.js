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
        skipComments: true,
      },
    ],
  },
  overrides: [
    {
      files: ["*.spec.ts", "**/lib/test/**/*.ts"],
      rules: {
        "@typescript-eslint/unbound-method": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "max-lines": [
          "warn",
          {
            max: 200,
            skipBlankLines: true,
            skipComments: true,
          },
        ],
      },
    },
    {
      files: ["*.d.ts"],
      rules: {
        "max-lines": "off",
      },
    },
  ],
};
