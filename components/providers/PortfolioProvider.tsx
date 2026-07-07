"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { i18n, type Dict, type Lang } from "@/lib/i18n";
import { siteConfig } from "@/site.config";
import { useTheme, type Theme } from "@/hooks/useTheme";
import { useLang } from "@/hooks/useLang";

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

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function usePortfolio(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within <PortfolioProvider>");
  return ctx;
}

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
