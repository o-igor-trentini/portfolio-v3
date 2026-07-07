import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import type { Lang } from "@/lib/i18n";
import { COLOR, introLines, mk, runTerminalCommand, type Line } from "@/lib/terminal";
import { track } from "@/lib/analytics";
import { PROMPT } from "@/site.config";

/** Everything the buffer needs from the portfolio context to run commands. */
export interface TerminalBufferDeps {
  termOpen: boolean;
  bonusNonce: number;
  lang: Lang;
  theme: "light" | "dark";
  name: string;
  setLang: (lang: Lang) => void;
  toggleTheme: () => void;
  closeTerm: () => void;
}

export interface TerminalBuffer {
  lines: Line[];
  input: string;
  setInput: (value: string) => void;
  onInputKey: (e: KeyboardEvent<HTMLInputElement>) => void;
  bodyRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
}

/**
 * Owns the terminal's output buffer, input value and command history, plus the
 * autoscroll/focus/intro/konami effects. Keeps `Terminal.tsx` purely presentational,
 * mirroring how `useTerminal` already extracts the open/close concern.
 */
export function useTerminalBuffer({
  termOpen,
  bonusNonce,
  lang,
  theme,
  name,
  setLang,
  toggleTheme,
  closeTerm,
}: TerminalBufferDeps): TerminalBuffer {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [cmds, setCmds] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(0);

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Seed the intro the first time the terminal opens (and keep the buffer after).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- respond to open transition
    if (termOpen) setLines((prev) => (prev.length ? prev : introLines()));
  }, [termOpen]);

  // Konami bonus line — driven by an external nonce from the provider.
  useEffect(() => {
    if (bonusNonce === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- respond to nonce change
    setLines((prev) => {
      const base = prev.length ? prev : introLines();
      return [...base, mk("★ konami unlocked — you found the cheat code.", COLOR.accent)];
    });
  }, [bonusNonce]);

  // Autoscroll to the newest output.
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  // Focus the input shortly after opening.
  useEffect(() => {
    if (!termOpen) return;
    const id = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(id);
  }, [termOpen]);

  function recall(dir: number) {
    if (!cmds.length) return;
    let idx = histIdx + dir;
    idx = Math.max(0, Math.min(cmds.length, idx));
    setHistIdx(idx);
    setInput(idx >= cmds.length ? "" : cmds[idx]);
  }

  function runCommand(line: string) {
    const cmd = line.trim();
    const echo = mk(line, COLOR.fg, PROMPT);
    const nextCmds = cmd ? [...cmds, cmd] : cmds;

    setInput("");
    setCmds(nextCmds);
    setHistIdx(nextCmds.length);

    if (!cmd) {
      setLines((prev) => [...prev, echo]);
      return;
    }

    const parts = cmd.split(/\s+/);
    const cname = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Track the base command name only — keeps event cardinality low (no args).
    track({ name: "terminal_command", params: { command: cname } });

    // Control commands act on the buffer / visibility, so they stay here.
    if (cname === "clear") {
      setLines([]);
      return;
    }
    if (cname === "exit") {
      setLines((prev) => [...prev, echo]);
      setTimeout(() => closeTerm(), 120);
      return;
    }

    const out = runTerminalCommand(cname, { args, lang, theme, name, setLang, toggleTheme });
    setLines((prev) => [...prev, echo, ...out, mk("")]);
  }

  function onInputKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      runCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      recall(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      recall(1);
    }
  }

  return { lines, input, setInput, onInputKey, bodyRef, inputRef };
}
