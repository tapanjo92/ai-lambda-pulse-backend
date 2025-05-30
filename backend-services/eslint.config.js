import { defineConfig } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default defineConfig([
  {
    // Apply to all TS files
    files: ["**/*.ts"],

    // Use the TS parser & project settings
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: "./tsconfig.json" },
    },

    // Enable the TS plugin
    plugins: { "@typescript-eslint": tsPlugin },

    // Use the recommended rule set
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },
]);
