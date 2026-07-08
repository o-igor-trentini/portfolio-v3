"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { TerminalSource } from "@/lib/analytics";
import { useTerminal } from "@/hooks/useTerminal";

interface TerminalContextValue {
  termOpen: boolean;
  openTerm: (source: TerminalSource) => void;
  closeTerm: () => void;
  /** Increments when the Konami code is entered — the terminal prints a bonus line. */
  bonusNonce: number;
}

const TerminalContext = createContext<TerminalContextValue | null>(null);

export function useTerminalControls(): TerminalContextValue {
  const ctx = useContext(TerminalContext);
  if (!ctx) throw new Error("useTerminalControls must be used within <TerminalProvider>");
  return ctx;
}

/**
 * Holds the terminal's open/close + Konami state, split out of PortfolioProvider
 * so opening or closing the terminal (a frequent toggle) no longer re-renders
 * every content section that only reads `t`/`lang`. Only the three consumers of
 * this context (Hero, Footer and the Terminal itself) react to it.
 */
export function TerminalProvider({ children }: { children: ReactNode }) {
  const { termOpen, openTerm, closeTerm, bonusNonce } = useTerminal();
  const value = useMemo<TerminalContextValue>(
    () => ({ termOpen, openTerm, closeTerm, bonusNonce }),
    [termOpen, openTerm, closeTerm, bonusNonce],
  );
  return <TerminalContext.Provider value={value}>{children}</TerminalContext.Provider>;
}
