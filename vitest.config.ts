import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // react enables JSX in component tests; tsconfigPaths resolves the `@/*` alias.
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Resolve CSS Module class names to their literal name (e.g. styles.btn === "btn")
    // so component-contract tests can assert on the original BEM class names.
    css: { modules: { classNameStrategy: "non-scoped" } },
    coverage: {
      provider: "v8",
      // Report on the source we actually author; skip generated/config/type files
      // and the build-time image routes (JSX ImageResponse isn't unit-tested).
      include: ["lib/**", "hooks/**", "components/**", "app/**"],
      exclude: [
        "**/*.test.{ts,tsx}",
        "**/*.d.ts",
        "lib/og.tsx",
        // Build-time image routes render ImageResponse — not unit-tested.
        "app/**/{icon,apple-icon,opengraph-image}.tsx",
        "app/**/layout.tsx",
        "app/**/page.tsx",
        "app/global-error.tsx",
        "app/global-not-found.tsx",
      ],
      // lcov feeds optional Codecov / editor gutters; text/html stay for local use.
      reporter: ["text", "html", "lcov"],
      // Ratchet: fail CI if coverage regresses below the current floor.
      thresholds: { statements: 80, branches: 65, functions: 75, lines: 80 },
    },
  },
});
