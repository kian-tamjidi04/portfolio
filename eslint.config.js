import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // `.claude/worktrees` holds git worktrees of this same repo, so linting it
  // means linting a second copy of src/ — and typescript-eslint refuses
  // outright, seeing two candidate tsconfig roots. `docs` is committed build
  // output, the deployed twin of the ignored `dist`.
  globalIgnores(['dist', 'docs', '.claude/worktrees']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
])
