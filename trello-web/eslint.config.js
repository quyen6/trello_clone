// eslint.config.js (Flat config)
import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs["recommended"].rules,
      ...reactRefresh.configs.vite.rules,
      "no-unused-vars": ["warn", { varsIgnorePattern: "^[A-Z_]" }],
      "no-console": "warn",
      "no-lonely-if": "warn",
      "no-trailing-spaces": "warn",
      "no-multi-spaces": "warn",
      "no-multiple-empty-lines": "warn",
      "space-before-blocks": ["error", "always"],
      "object-curly-spacing": ["warn", "always"],
      indent: ["warn", 2],
      // semi: ["warn", "never"], // Không sử dụng dấu chấm phẩy
      // quotes: ["error", "single"], // Sử dụng dấu nháy đơn
      "array-bracket-spacing": "warn",
      "linebreak-style": "off",
      "no-unexpected-multiline": "warn",
      "keyword-spacing": "warn",
      // "comma-dangle": "warn",
      "comma-spacing": "warn",
      "arrow-spacing": "warn",
    },
  },
]);
