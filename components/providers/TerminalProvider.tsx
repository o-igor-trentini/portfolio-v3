"use client";

import { useMemo, type ReactNode } from "react";
import type { TerminalSource } from "@/lib/analytics";
import { useTerminal } from "@/hooks/useTerminal";
import { createSafeContext } from "./createSafeContext";

interface TerminalContextValue {
  termOpen: boolean;
  openTerm: (source: TerminalSource) => void;
  closeTerm: () => void;
  /** Increments when the Konami code is entered — the terminal prints a bonus line. */
  bonusNonce: number;
}

const [TerminalContext, useTerminalControls] = createSafeContext<TerminalContextValue>(
  "useTerminalControls",
  "TerminalProvider",
);
export { useTerminalControls };

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
