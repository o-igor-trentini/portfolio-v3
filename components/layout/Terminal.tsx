"use client";

import { useRef } from "react";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { useTerminalBuffer } from "@/hooks/useTerminalBuffer";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { cx } from "@/lib/cx";
import { PROMPT } from "@/site.config";
import styles from "./Terminal.module.css";

export function Terminal() {
  const { termOpen, closeTerm, bonusNonce, lang, theme, setLang, toggleTheme, name } =
    usePortfolio();

  const windowRef = useRef<HTMLDivElement>(null);
  const { lines, input, setInput, onInputKey, bodyRef, inputRef } = useTerminalBuffer({
    termOpen,
    bonusNonce,
    lang,
    theme,
    name,
    setLang,
    toggleTheme,
    closeTerm,
  });

  // Keep focus inside the modal while open and restore it to the trigger on close.
  useFocusTrap(windowRef, termOpen);

  if (!termOpen) return null;

  return (
    <div className={styles["term-overlay"]} onClick={closeTerm}>
      <div
        ref={windowRef}
        className={styles["term-window"]}
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles["term-titlebar"]}>
          <span className={cx(styles["term-dot"], styles["term-dot--red"])} />
          <span className={cx(styles["term-dot"], styles["term-dot--amber"])} />
          <span className={cx(styles["term-dot"], styles["term-dot--green"])} />
          <span className={styles["term-title"]}>visitor@portfolio: ~/zsh</span>
          <button
            type="button"
            className={styles["term-close"]}
            aria-label="Close terminal"
            onClick={closeTerm}
          >
            ✕
          </button>
        </div>
        <div
          className={styles["term-body"]}
          ref={bodyRef}
          role="log"
          aria-live="polite"
          aria-label="terminal output"
          onClick={() => inputRef.current?.focus()}
        >
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
