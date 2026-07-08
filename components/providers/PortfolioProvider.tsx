"use client";

import { useMemo, type ReactNode } from "react";
import { i18n, type Dict, type Lang } from "@/lib/i18n";
import { siteConfig } from "@/site.config";
import { useTheme, type Theme } from "@/hooks/useTheme";
import { useLang } from "@/hooks/useLang";
import { createSafeContext } from "./createSafeContext";

interface PortfolioContextValue {
  name: string;
  handle: string;
  lang: Lang;
  t: Dict;
  setLang: (lang: Lang) => void;
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const [PortfolioContext, usePortfolio] = createSafeContext<PortfolioContextValue>(
  "usePortfolio",
  "PortfolioProvider",
);
export { usePortfolio };

export function PortfolioProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: ReactNode;
}) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { lang, setLang } = useLang(initialLang);

  const value = useMemo<PortfolioContextValue>(
    () => ({
      name: siteConfig.name,
      handle: siteConfig.handle,
      lang,
      t: i18n[lang],
      setLang,
      theme,
      isDark,
      toggleTheme,
    }),
    [lang, setLang, theme, isDark, toggleTheme],
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}
