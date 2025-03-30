import { defineConfig } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"


export default defineConfig([
  tseslint.configs.base,
  { 
    files: ["**/*.{ts,mts,cts}"], 
    ignores: ["**/tests/**", "**/test/**", "**/dist/**", "**/build/**", "**/*.js", "**/*.test.js"], 
    rules: {
      semi: ["error", "never"],
      "eol-last": ["error", "always"],
    },
    languageOptions: { globals: globals.browser },
  }
])
