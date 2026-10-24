import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Build output that must never be linted:
    "dist/**",      // Sanity Studio build (370 MB) — crashed ESLint with OOM
    ".sanity/**",
    "public/**",
    "node_modules/**",
  ]),
]);

export default eslintConfig;
