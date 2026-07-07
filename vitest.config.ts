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
      include: ["lib/**", "hooks/**", "components/**"],
      exclude: ["**/*.test.{ts,tsx}", "**/*.d.ts", "lib/og.tsx"],
      reporter: ["text", "html"],
    },
  },
});
