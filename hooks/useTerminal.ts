import { useCallback, useEffect, useRef, useState } from "react";

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
  openTerm: () => void;
  closeTerm: () => void;
  /** Increments when the Konami code is entered — the terminal prints a bonus line. */
  bonusNonce: number;
}

export function useTerminal(): UseTerminal {
  const [termOpen, setTermOpen] = useState(false);
  const [bonusNonce, setBonusNonce] = useState(0);
  const konami = useRef<string[]>([]);

  const openTerm = useCallback(() => setTermOpen(true), []);
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

  return { termOpen, openTerm, closeTerm, bonusNonce };
}
