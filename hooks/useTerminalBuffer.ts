import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import {
  COLOR,
  completeCommand,
  introLines,
  mk,
  runTerminalCommand,
  type Line,
} from "@/lib/terminal";
import { track } from "@/lib/analytics";
import { applyConsent, getConsent, storeConsent, type ConsentValue } from "@/lib/consent";
import { PROMPT } from "@/site.config";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { useTerminalControls } from "@/components/providers/TerminalProvider";

// Focus the input just after the open transition paints (a tick, not instant,
// so the modal is mounted first). Exit echoes the command, then closes after a
// short beat so the visitor sees the `exit` line before the overlay disappears.
const FOCUS_DELAY_MS = 30;
const EXIT_DELAY_MS = 120;

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
 * autoscroll/focus/intro/konami effects. Reads what it needs directly from the
 * portfolio + terminal contexts, keeping `Terminal.tsx` purely presentational.
 */
export function useTerminalBuffer(): TerminalBuffer {
  const { lang, theme, name, setLang, toggleTheme } = usePortfolio();
  const { termOpen, bonusNonce, closeTerm } = useTerminalControls();
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
    const id = setTimeout(() => inputRef.current?.focus(), FOCUS_DELAY_MS);
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
      setTimeout(() => closeTerm(), EXIT_DELAY_MS);
      return;
    }

    const setConsent = (value: ConsentValue) => {
      storeConsent(value);
      applyConsent(value);
    };
    const out = runTerminalCommand(cname, {
      args,
      lang,
      theme,
      name,
      setLang,
      toggleTheme,
      consent: getConsent(),
      setConsent,
    });
    setLines((prev) => [...prev, echo, ...out, mk("")]);
  }

  function complete() {
    // Completes the command name, or the last argument for commands with a known
    // vocabulary (e.g. `lang`, `cat`, `consent`) — see completeCommand.
    const { completed, candidates } = completeCommand(input);
    if (completed) {
      setInput(completed);
    } else if (candidates.length > 1) {
      setLines((prev) => [...prev, mk(candidates.join("   "), COLOR.muted)]);
    }
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
    } else if (e.key === "Tab" && !e.shiftKey && input.trim() !== "") {
      // Only hijack forward-Tab for completion when there's a prefix to complete.
      // On an empty input, let Tab fall through to the focus trap so keyboard
      // users can still move focus onto the close button (see Terminal.tsx).
      e.preventDefault();
      complete();
    }
  }

  return { lines, input, setInput, onInputKey, bodyRef, inputRef };
}
