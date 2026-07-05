"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { COLOR, introLines, mk, runTerminalCommand, type Line } from "@/lib/terminal";
import { PROMPT } from "@/site.config";
import styles from "./Terminal.module.css";

export function Terminal() {
  const { termOpen, closeTerm, bonusNonce, lang, theme, setLang, toggleTheme, name } = usePortfolio();

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

  function runCommand(raw: string) {
    const line = String(raw);
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

    // Control commands act on the buffer / visibility, so they stay in the component.
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

  if (!termOpen) return null;

  return (
    <div className={styles["term-overlay"]} onClick={closeTerm}>
      <div className={styles["term-window"]} role="dialog" aria-modal="true" aria-label="Terminal" onClick={(e) => e.stopPropagation()}>
        <div className={styles["term-titlebar"]}>
          <span className={styles["term-dot"]} style={{ background: "#ff5f57" }} />
          <span className={styles["term-dot"]} style={{ background: "#febc2e" }} />
          <span className={styles["term-dot"]} style={{ background: "#28c840" }} />
          <span className={styles["term-title"]}>visitor@portfolio: ~/zsh</span>
          <button type="button" className={styles["term-close"]} aria-label="Close terminal" onClick={closeTerm}>
            ✕
          </button>
        </div>
        <div className={styles["term-body"]} ref={bodyRef} onClick={() => inputRef.current?.focus()}>
          {lines.map((l, i) => (
            <div key={i} className={styles["term-line"]}>
              {l.prompt && <span className={styles["term-prompt"]}>{l.prompt} </span>}
              <span style={{ color: l.color }}>{l.text}</span>
            </div>
          ))}
          <div className={styles["term-inputrow"]}>
            <span className={styles["term-inputrow__prompt"]}>{PROMPT}</span>
            <input
              ref={inputRef}
              className={styles["term-input"]}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onInputKey}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              aria-label="terminal input"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
