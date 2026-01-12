module.exports = {
  root: true,
  ignorePatterns: ["projects/**/*", "dist", "node_modules"],
  overrides: [
    {
      files: ["*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {project: ["./tsconfig.json"], sourceType: "module"},
      plugins: ["@typescript-eslint", "@angular-eslint"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@angular-eslint/recommended",
        "prettier",
      ],
      rules: {
        "prefer-const": "warn",
        "no-console": "warn",
        "no-unused-vars": "warn",
        "@typescript-eslint/no-explicit-any": "warn",
      },
    },
    {
      files: ["*.html"],
      parser: "@angular-eslint/template-parser",
      plugins: ["@angular-eslint/template"],
      extends: ["plugin:@angular-eslint/template/recommended"],
      rules: {},
    },
  ],
};
