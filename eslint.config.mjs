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
    // Auto-generated Prisma client — do not lint
    "lib/generated/**",
    // Michigan routes/data parked for the New Jersey rebuild. Excluded from
    // tsconfig as well, so it never compiles or ships; linting it only
    // produces noise about code that is intentionally inert.
    "staged-for-nj/**",
  ]),
]);

export default eslintConfig;
