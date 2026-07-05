"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { i18n, type Dict, type Lang } from "@/lib/i18n";
import { siteConfig } from "@/site.config";
import { useTheme, type Theme } from "@/hooks/useTheme";
import { useLang } from "@/hooks/useLang";
import { useTerminal } from "@/hooks/useTerminal";

interface PortfolioContextValue {
  name: string;
  handle: string;
  lang: Lang;
  t: Dict;
  setLang: (lang: Lang) => void;
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  showProjects: boolean;
  showCerts: boolean;
  // terminal
  termOpen: boolean;
  openTerm: () => void;
  closeTerm: () => void;
  /** Increments when the Konami code is entered — the terminal listens and prints a bonus line. */
  bonusNonce: number;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function usePortfolio(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within <PortfolioProvider>");
  return ctx;
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { lang, setLang } = useLang();
  const { termOpen, openTerm, closeTerm, bonusNonce } = useTerminal();

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
      showProjects: siteConfig.showProjects,
      showCerts: siteConfig.showCerts,
      termOpen,
      openTerm,
      closeTerm,
      bonusNonce,
    }),
    [lang, setLang, theme, isDark, toggleTheme, termOpen, openTerm, closeTerm, bonusNonce],
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}
