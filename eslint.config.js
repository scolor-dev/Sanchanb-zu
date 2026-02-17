import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
  // build成果物などを無視
  globalIgnores(["dist"]),

  // まず共通（JS/TS両方）に適用する推奨ルール群を並べる
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,

  // JS/TS共通の対象ファイル + 言語設定
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: globals.browser,
    },
  },

  // TS/TSXだけに効かせたい設定があればここに追加
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // JSのno-unused-varsとTS版の衝突を避けたいなら（好み）
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn"],
    },
  },
])
