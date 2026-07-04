"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { i18n, type Dict, type Lang } from "@/lib/i18n";
import { siteConfig } from "@/site.config";

type Theme = "dark" | "light";

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

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function PortfolioProvider({ children }: { children: ReactNode }) {
  // Deterministic SSR defaults; corrected from the DOM/localStorage after mount.
  const [theme, setTheme] = useState<Theme>(siteConfig.defaultTheme === "light" ? "light" : "dark");
  const [lang, setLangState] = useState<Lang>("en");
  const [termOpen, setTermOpen] = useState(false);
  const [bonusNonce, setBonusNonce] = useState(0);
  const konami = useRef<string[]>([]);

  // Sync theme from the value the pre-hydration script wrote onto <html>.
  // Intentional post-mount reconciliation of client-only state (localStorage /
  // system preference) that cannot be known during SSR without a hydration mismatch.
  useEffect(() => {
    const domTheme = document.documentElement.dataset.theme;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration reconciliation
    if (domTheme === "light" || domTheme === "dark") setTheme(domTheme);
  }, []);

  // Resolve stored / preferred language after mount (same reconciliation rationale).
  useEffect(() => {
    try {
      const stored = localStorage.getItem("pf_lang");
      if (stored === "en" || stored === "pt") {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration reconciliation
        setLangState(stored);
        return;
      }
    } catch {
      /* ignore */
    }
    if (typeof navigator !== "undefined" && (navigator.language || "").toLowerCase().startsWith("pt")) {
      setLangState("pt");
    }
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

  const setLang = useCallback((next: Lang) => {
    try {
      localStorage.setItem("pf_lang", next);
    } catch {
      /* ignore */
    }
    setLangState(next);
  }, []);

  const openTerm = useCallback(() => setTermOpen(true), []);
  const closeTerm = useCallback(() => setTermOpen(false), []);

  // Global keyboard shortcuts: backtick opens the terminal, Esc closes it,
  // and the Konami code opens it with a bonus line.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName ?? "";
      const typing = tag === "INPUT" || tag === "TEXTAREA";

      if ((e.key === "`" || e.key === "~") && !termOpen && !typing) {
        e.preventDefault();
        setTermOpen(true);
        return;
      }
      if (e.key === "Escape" && termOpen) {
        setTermOpen(false);
        return;
      }

      konami.current.push(e.key);
      if (konami.current.length > KONAMI.length) konami.current.shift();
      if (
        konami.current.length === KONAMI.length &&
        konami.current.every((k, i) => k === KONAMI[i])
      ) {
        konami.current = [];
        setTermOpen(true);
        setBonusNonce((n) => n + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [termOpen]);

  const value = useMemo<PortfolioContextValue>(
    () => ({
      name: siteConfig.name,
      handle: siteConfig.handle,
      lang,
      t: i18n[lang],
      setLang,
      theme,
      isDark: theme !== "light",
      toggleTheme,
      showProjects: siteConfig.showProjects,
      showCerts: siteConfig.showCerts,
      termOpen,
      openTerm,
      closeTerm,
      bonusNonce,
    }),
    [lang, setLang, theme, toggleTheme, termOpen, openTerm, closeTerm, bonusNonce],
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}
