import { useCallback, useEffect, useState } from "react";
import { siteConfig } from "@/site.config";

export type Theme = "dark" | "light";

export interface UseTheme {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

export function useTheme(): UseTheme {
  // Deterministic SSR default; reconciled from the DOM after mount.
  const [theme, setTheme] = useState<Theme>(siteConfig.defaultTheme === "light" ? "light" : "dark");

  // Sync from the value the pre-hydration script wrote onto <html> — client-only
  // state (localStorage / system preference) unknowable during SSR without a mismatch.
  useEffect(() => {
    const domTheme = document.documentElement.dataset.theme;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration reconciliation
    if (domTheme === "light" || domTheme === "dark") setTheme(domTheme);
  }, []);

  const applyTheme = useCallback((next: Theme) => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("pf_theme", next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light";
      applyTheme(next);
      return next;
    });
  }, [applyTheme]);

  return { theme, isDark: theme !== "light", toggleTheme };
}
