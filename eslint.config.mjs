import { defineConfig } from "eslint/config"
import globals from "globals"
import js from "@eslint/js"
import tseslint from "typescript-eslint"


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts}"], ignores: ["dist/**"] },
  { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser }, ignores: ["dist/**"] },
  { 
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      semi: ["error", "never"],
      "eol-last": ["error", "always"],
    },
    ignores: ["dist/**"]
  },
  tseslint.configs.recommended,
])
