import { useCallback, useEffect, useRef, useState } from "react";
import { track, type TerminalSource } from "@/lib/analytics";

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

export interface UseTerminal {
  termOpen: boolean;
  openTerm: (source: TerminalSource) => void;
  closeTerm: () => void;
  /** Increments when the Konami code is entered — the terminal prints a bonus line. */
  bonusNonce: number;
}

export function useTerminal(): UseTerminal {
  const [termOpen, setTermOpen] = useState(false);
  const [bonusNonce, setBonusNonce] = useState(0);
  const konami = useRef<string[]>([]);

  const openTerm = useCallback((source: TerminalSource) => {
    setTermOpen(true);
    track({ name: "terminal_open", params: { source } });
  }, []);
  const closeTerm = useCallback(() => setTermOpen(false), []);

  // Global shortcuts: backtick opens the terminal, Esc closes it, and the Konami
  // code opens it with a bonus line. Kept as a single listener so backtick/Esc
  // short-circuit and are not fed into the Konami buffer (original behaviour).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName ?? "";
      const typing = tag === "INPUT" || tag === "TEXTAREA";

      if ((e.key === "`" || e.key === "~") && !termOpen && !typing) {
        e.preventDefault();
        openTerm("key");
        return;
      }
      if (e.key === "Escape" && termOpen) {
        setTermOpen(false);
        return;
      }

      // Don't feed keystrokes typed into a field (e.g. the terminal's own
      // ArrowUp/ArrowDown history recall) into the Konami buffer, or paging
      // through history could accidentally trigger the easter egg + analytics.
      if (typing) return;

      konami.current.push(e.key);
      if (konami.current.length > KONAMI.length) konami.current.shift();
      if (
        konami.current.length === KONAMI.length &&
        konami.current.every((k, i) => k === KONAMI[i])
      ) {
        konami.current = [];
        openTerm("konami");
        setBonusNonce((n) => n + 1);
        track({ name: "konami_unlocked" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [termOpen, openTerm]);

  return { termOpen, openTerm, closeTerm, bonusNonce };
}
